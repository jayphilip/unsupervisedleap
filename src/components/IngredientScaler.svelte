<script lang="ts">
  // Parses ingredient strings like "2 cups flour" or "½ tsp salt" or "1/3 cup milk"
  // Returns { qty: number | null, unit: string, rest: string }
  function parseIngredient(raw: string) {
    // Handle unicode fractions
    const fractionMap: Record<string, number> = {
      '½': 0.5, '⅓': 1/3, '⅔': 2/3, '¼': 0.25, '¾': 0.75,
      '⅛': 0.125, '⅜': 0.375, '⅝': 0.625, '⅞': 0.875,
    };

    let s = raw.trim();

    // Replace unicode fractions
    for (const [frac, val] of Object.entries(fractionMap)) {
      s = s.replace(frac, ` ${val} `);
    }

    // Match: optional whole number + optional fraction (e.g. "1 1/2" or "1/3" or "2")
    const match = s.match(/^(\d+)?\s*(\d+\/\d+)?\s*(.*)/);
    if (!match) return { qty: null, rest: raw };

    let qty: number | null = null;
    const [, whole, frac, rest] = match;

    if (whole || frac) {
      qty = (whole ? parseFloat(whole) : 0) + (frac ? eval(frac) : 0);
      if (qty === 0) qty = null;
    }

    return { qty, rest: rest.trim() };
  }

  function formatQty(n: number): string {
    const fractions: [number, string][] = [
      [0.125, '⅛'], [0.25, '¼'], [0.333, '⅓'], [0.375, '⅜'],
      [0.5, '½'], [0.625, '⅝'], [0.667, '⅔'], [0.75, '¾'], [0.875, '⅞'],
    ];
    const whole = Math.floor(n);
    const dec = n - whole;
    const tol = 0.04;
    const fracStr = fractions.find(([v]) => Math.abs(dec - v) < tol)?.[1] ?? '';
    if (!fracStr && dec > tol) return n.toFixed(1).replace(/\.0$/, '');
    if (whole === 0) return fracStr || '0';
    return fracStr ? `${whole} ${fracStr}` : `${whole}`;
  }

  interface Props {
    ingredients: string[];
    defaultScale?: 1 | 2 | 4;
  }

  let { ingredients, defaultScale = 1 }: Props = $props();

  const scales = [1, 2, 4] as const;
  let scale = $state<number>(defaultScale);

  const parsed = ingredients.map(parseIngredient);

  function scaledLine(item: ReturnType<typeof parseIngredient>): string {
    if (item.qty === null) return item.rest;
    return `${formatQty(item.qty * scale)} ${item.rest}`;
  }
</script>

<div class="scaler">
  <div class="scaler-header">
    <span class="scaler-label">Ingredients</span>
    <div class="scaler-buttons" role="group" aria-label="Scale recipe">
      {#each scales as s}
        <button
          class="scaler-btn"
          class:active={scale === s}
          onclick={() => (scale = s)}
          aria-pressed={scale === s}
        >{s}×</button>
      {/each}
    </div>
  </div>

  <ul class="scaler-list">
    {#each parsed as item}
      <li>{scaledLine(item)}</li>
    {/each}
  </ul>
</div>

<style>
  .scaler {
    margin: 1.5em 0;
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
    background: var(--entry);
    font-family: var(--font-sans);
  }

  .scaler-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75em 1.25em;
    border-bottom: 1px solid var(--border);
    gap: 1em;
  }

  .scaler-label {
    font-size: 0.72em;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    font-weight: 700;
    color: var(--secondary);
  }

  .scaler-buttons {
    display: flex;
    gap: 0.3em;
  }

  .scaler-btn {
    padding: 0.25em 0.7em;
    font-size: 0.78em;
    font-weight: 600;
    font-family: var(--font-sans);
    border-radius: 6px;
    border: 1px solid var(--border);
    background: none;
    color: var(--secondary);
    cursor: pointer;
    transition: all 0.15s;
  }

  .scaler-btn:hover {
    border-color: var(--accent);
    color: var(--accent);
  }

  .scaler-btn.active {
    background: color-mix(in srgb, var(--accent) 15%, var(--entry));
    border-color: var(--accent);
    color: var(--accent);
  }

  .scaler-list {
    margin: 0;
    padding: 1em 1.25em 1.1em 2.25em;
    display: grid;
    gap: 0.45em;
  }

  .scaler-list li {
    font-size: 0.9em;
    color: var(--content);
    line-height: 1.45;
    transition: color 0.15s;
  }
</style>

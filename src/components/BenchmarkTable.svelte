<script lang="ts">
  interface Benchmark {
    name: string;
    scores: number[];              // one per model, in same order as `models`
    max?: number;                  // for normalising; defaults to 100
    higherIsBetter?: boolean;      // defaults to true
    description?: string;          // tooltip-style note
  }

  interface Props {
    models: string[];
    benchmarks: Benchmark[];
    title?: string;
    caption?: string;
    highlightBest?: boolean;       // bold the best score per row
  }

  let {
    models,
    benchmarks,
    title,
    caption,
    highlightBest = true,
  }: Props = $props();

  function best(b: Benchmark): number {
    const hi = b.higherIsBetter !== false;
    return hi ? Math.max(...b.scores) : Math.min(...b.scores);
  }

  function isBest(b: Benchmark, score: number): boolean {
    if (!highlightBest) return false;
    return score === best(b);
  }

  // Heat-map: 0–1 where 1 = best, 0 = worst
  function heat(b: Benchmark, score: number): number {
    const hi = b.higherIsBetter !== false;
    const min = Math.min(...b.scores);
    const max = Math.max(...b.scores);
    if (max === min) return 0.5;
    return hi ? (score - min) / (max - min) : (max - score) / (max - min);
  }

  // CSS background: accent tint scaled by heat
  function cellBg(h: number): string {
    const pct = Math.round(h * 22);
    return `color-mix(in srgb, var(--accent) ${pct}%, var(--entry))`;
  }

  function fmt(v: number) {
    return Number.isInteger(v) ? String(v) : v.toFixed(1);
  }
</script>

<figure class="bmt-wrap">
  {#if title}
    <p class="bmt-title">{title}</p>
  {/if}

  <div class="bmt-scroll">
    <table class="bmt">
      <thead>
        <tr>
          <th class="bmt-benchmark-col">Benchmark</th>
          {#each models as model}
            <th>{model}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each benchmarks as b}
          <tr>
            <td class="bmt-name">
              {b.name}
              {#if b.description}
                <span class="bmt-desc">{b.description}</span>
              {/if}
            </td>
            {#each b.scores as score, i}
              <td
                class="bmt-score"
                class:bmt-best={isBest(b, score)}
                style="background: {cellBg(heat(b, score))}"
              >
                {fmt(score)}
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  {#if caption}
    <figcaption class="bmt-caption">{caption}</figcaption>
  {/if}
</figure>

<style>
  .bmt-wrap {
    margin: 1.75em 0;
    font-family: var(--font-sans);
  }

  .bmt-title {
    margin: 0 0 0.6em;
    font-size: 0.78em;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--secondary);
  }

  .bmt-scroll {
    overflow-x: auto;
    border: 1px solid var(--border);
    border-radius: 10px;
  }

  .bmt {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.82em;
    min-width: 400px;
  }

  thead tr {
    background: color-mix(in srgb, var(--accent) 6%, var(--entry));
    border-bottom: 2px solid var(--border);
  }

  th {
    padding: 0.65em 1em;
    text-align: center;
    font-weight: 700;
    font-size: 0.85em;
    color: var(--primary);
    white-space: nowrap;
  }

  th.bmt-benchmark-col {
    text-align: left;
    color: var(--secondary);
    font-weight: 600;
    width: 160px;
    min-width: 130px;
  }

  tbody tr {
    border-bottom: 1px solid var(--border);
  }

  tbody tr:last-child {
    border-bottom: none;
  }

  tbody tr:hover td {
    filter: brightness(1.06);
  }

  .bmt-name {
    padding: 0.6em 1em;
    color: var(--primary);
    font-weight: 600;
    white-space: nowrap;
    vertical-align: top;
  }

  .bmt-desc {
    display: block;
    font-size: 0.85em;
    font-weight: 400;
    color: var(--secondary);
    font-style: italic;
    white-space: normal;
    margin-top: 0.1em;
  }

  .bmt-score {
    padding: 0.6em 0.9em;
    text-align: center;
    font-variant-numeric: tabular-nums;
    font-weight: 500;
    color: var(--primary);
    transition: background 0.2s ease;
  }

  .bmt-score.bmt-best {
    font-weight: 800;
    color: var(--accent);
  }

  .bmt-caption {
    margin: 0.55em 0 0;
    font-size: 0.75em;
    color: var(--secondary);
    font-style: italic;
    text-align: center;
  }
</style>

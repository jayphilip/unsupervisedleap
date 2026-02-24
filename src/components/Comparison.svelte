<script lang="ts">
  interface Side {
    label: string;
    image?: string;
    items: string[];
    verdict?: string;
    color?: string; // optional accent override
  }

  interface Props {
    title?: string;
    a: Side;
    b: Side;
    winner?: 'a' | 'b' | 'tie';
  }

  let { title, a, b, winner }: Props = $props();

  const colorA = a.color ?? 'var(--link)';
  const colorB = b.color ?? 'var(--accent)';
</script>

<div class="comparison">
  {#if title}
    <p class="comparison-title">{title}</p>
  {/if}

  <div class="comparison-grid">
    <!-- Side A -->
    <div class="comparison-side" style="--side-color: {colorA}">
      <span class="comparison-winner-badge" class:hidden={winner !== 'a'} aria-label="Winner" aria-hidden={winner !== 'a'}>★ Winner</span>
      {#if a.image}
        <div class="comparison-img-wrap">
          <img src={a.image} alt={a.label} loading="lazy" />
        </div>
      {/if}
      <h3 class="comparison-label">{a.label}</h3>
      <ul class="comparison-items">
        {#each a.items as item}
          <li>{item}</li>
        {/each}
      </ul>
      {#if a.verdict}
        <p class="comparison-verdict">{a.verdict}</p>
      {/if}
    </div>

    <!-- VS divider -->
    <div class="comparison-vs" aria-hidden="true">
      {winner === 'tie' ? '=' : 'vs'}
    </div>

    <!-- Side B -->
    <div class="comparison-side" style="--side-color: {colorB}">
      <span class="comparison-winner-badge" class:hidden={winner !== 'b'} aria-label="Winner" aria-hidden={winner !== 'b'}>★ Winner</span>
      {#if b.image}
        <div class="comparison-img-wrap">
          <img src={b.image} alt={b.label} loading="lazy" />
        </div>
      {/if}
      <h3 class="comparison-label">{b.label}</h3>
      <ul class="comparison-items">
        {#each b.items as item}
          <li>{item}</li>
        {/each}
      </ul>
      {#if b.verdict}
        <p class="comparison-verdict">{b.verdict}</p>
      {/if}
    </div>
  </div>
</div>

<style>
  .comparison {
    margin: 2.5em 0;
    font-family: var(--font-sans);
  }

  .comparison-title {
    font-size: 0.72em;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--secondary);
    font-weight: 700;
    margin: 0 0 0.85em;
  }

  .comparison-grid {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 0;
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
  }

  .comparison-side {
    padding: 1.5em 1.4em;
    display: flex;
    flex-direction: column;
    gap: 0.75em;
    position: relative;
    background: var(--entry);
    border-top: 3px solid var(--side-color);
    transition: background 0.2s;
  }

  .comparison-side:hover {
    background: color-mix(in srgb, var(--side-color) 4%, var(--entry));
  }

  .comparison-winner-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.3em;
    font-size: 0.7em;
    font-weight: 700;
    color: var(--side-color);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .comparison-winner-badge.hidden {
    visibility: hidden;
  }

  .comparison-img-wrap {
    width: 100%;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    border-radius: 6px;
    background: var(--tertiary);
  }

  .comparison-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.35s ease;
  }

  .comparison-side:hover .comparison-img-wrap img {
    transform: scale(1.04);
  }

  .comparison-label {
    margin: 0;
    font-size: 1.05em;
    font-weight: 700;
    color: var(--primary);
    letter-spacing: -0.01em;
  }

  .comparison-items {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.4em;
    flex: 1;
  }

  .comparison-items li {
    font-size: 0.87em;
    color: var(--content);
    line-height: 1.45;
    padding-left: 1.1em;
    position: relative;
  }

  .comparison-items li::before {
    content: '·';
    position: absolute;
    left: 0;
    color: var(--side-color);
    font-weight: 700;
  }

  .comparison-verdict {
    margin: 0;
    font-size: 0.82em;
    font-style: italic;
    color: var(--secondary);
    border-top: 1px solid var(--border);
    padding-top: 0.65em;
    line-height: 1.5;
  }

  .comparison-vs {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 0.6em;
    font-size: 0.72em;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--secondary);
    background: var(--theme);
    border-left: 1px solid var(--border);
    border-right: 1px solid var(--border);
    writing-mode: vertical-lr;
    user-select: none;
  }

  @media (max-width: 540px) {
    .comparison-grid {
      grid-template-columns: 1fr;
    }

    .comparison-vs {
      writing-mode: horizontal-tb;
      padding: 0.6em;
      border-left: none;
      border-right: none;
      border-top: 1px solid var(--border);
      border-bottom: 1px solid var(--border);
    }
  }
</style>

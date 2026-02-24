<script lang="ts">
  interface Part {
    title: string;
    url: string;
    current?: boolean;
  }

  interface Props {
    seriesTitle: string;
    partNumber: number;
    totalParts: number;
    parts?: Part[];
    prev?: { title: string; url: string };
    next?: { title: string; url: string };
  }

  let { seriesTitle, partNumber, totalParts, parts, prev, next }: Props = $props();

  let expanded = $state(false);
</script>

<nav class="post-series" aria-label={`Series: ${seriesTitle}`}>
  <div class="ps-top">
    <div class="ps-meta">
      <span class="ps-label">Series</span>
      <span class="ps-title">{seriesTitle}</span>
    </div>
    <div class="ps-progress">
      <span class="ps-part">Part {partNumber} of {totalParts}</span>
      <div class="ps-pips" aria-hidden="true">
        {#each { length: totalParts } as _, i}
          <div
            class="ps-pip"
            class:active={i + 1 === partNumber}
            class:done={i + 1 < partNumber}
          ></div>
        {/each}
      </div>
    </div>
  </div>

  {#if parts && parts.length > 0}
    <div class="ps-parts-row">
      <button
        class="ps-toggle"
        onclick={() => { expanded = !expanded; }}
        aria-expanded={expanded}
      >
        {expanded ? 'Hide' : 'All posts in this series'} {expanded ? '▲' : '▼'}
      </button>

      {#if expanded}
        <ol class="ps-list">
          {#each parts as part, i}
            <li class="ps-item" class:current={part.current}>
              {#if part.current}
                <span class="ps-item-num">{i + 1}</span>
                <span class="ps-item-cur">{part.title}</span>
              {:else}
                <span class="ps-item-num">{i + 1}</span>
                <a href={part.url}>{part.title}</a>
              {/if}
            </li>
          {/each}
        </ol>
      {/if}
    </div>
  {/if}

  {#if prev || next}
    <div class="ps-nav">
      {#if prev}
        <a href={prev.url} class="ps-nav-link prev">
          <span class="ps-nav-dir">← Previous</span>
          <span class="ps-nav-title">{prev.title}</span>
        </a>
      {:else}
        <div></div>
      {/if}

      {#if next}
        <a href={next.url} class="ps-nav-link next">
          <span class="ps-nav-dir">Next →</span>
          <span class="ps-nav-title">{next.title}</span>
        </a>
      {:else}
        <div></div>
      {/if}
    </div>
  {/if}
</nav>

<style>
  .post-series {
    margin: 1.75em 0;
    border: 1px solid color-mix(in srgb, var(--accent) 28%, var(--border));
    border-radius: 10px;
    overflow: hidden;
    font-family: var(--font-sans);
    background: color-mix(in srgb, var(--accent) 5%, var(--entry));
  }

  /* ── top row ── */
  .ps-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1em;
    padding: 0.75em 1.1em;
    background: color-mix(in srgb, var(--accent) 10%, var(--entry));
    border-bottom: 1px solid color-mix(in srgb, var(--accent) 18%, var(--border));
    flex-wrap: wrap;
  }

  .ps-meta {
    display: flex;
    align-items: center;
    gap: 0.5em;
  }

  .ps-label {
    font-size: 0.7em;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    color: var(--accent);
    background: color-mix(in srgb, var(--accent) 15%, var(--entry));
    border: 1px solid color-mix(in srgb, var(--accent) 30%, var(--border));
    padding: 0.15em 0.5em;
    border-radius: 4px;
    line-height: 1.6;
  }

  .ps-title {
    font-size: 0.88em;
    font-weight: 600;
    color: var(--primary);
  }

  .ps-progress {
    display: flex;
    align-items: center;
    gap: 0.75em;
  }

  .ps-part {
    font-size: 0.78em;
    color: var(--secondary);
    white-space: nowrap;
  }

  .ps-pips {
    display: flex;
    gap: 4px;
  }

  .ps-pip {
    width: 20px;
    height: 5px;
    border-radius: 3px;
    background: color-mix(in srgb, var(--accent) 15%, var(--border));
    transition: background 0.2s;
  }
  .ps-pip.done   { background: color-mix(in srgb, var(--accent) 55%, var(--border)); }
  .ps-pip.active { background: var(--accent); }

  /* ── parts list toggle ── */
  .ps-parts-row {
    padding: 0 1.1em;
    border-top: 0;
  }

  .ps-toggle {
    display: inline-block;
    margin: 0.6em 0 0;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.78em;
    color: var(--link);
    padding: 0;
    font-family: var(--font-sans);
  }
  .ps-toggle:hover { color: var(--link-hover); text-decoration: underline; }

  .ps-list {
    margin: 0.5em 0 0.9em;
    padding-left: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.35em;
  }

  .ps-item {
    display: flex;
    align-items: baseline;
    gap: 0.55em;
    font-size: 0.85em;
  }

  .ps-item-num {
    width: 1.4em;
    text-align: right;
    color: var(--secondary);
    font-size: 0.8em;
    flex-shrink: 0;
  }

  .ps-item a {
    color: var(--link);
    text-decoration: none;
  }
  .ps-item a:hover { text-decoration: underline; }

  .ps-item.current .ps-item-cur {
    font-weight: 600;
    color: var(--primary);
  }
  .ps-item.current .ps-item-num {
    color: var(--accent);
  }

  /* ── prev/next navigation ── */
  .ps-nav {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-top: 1px solid color-mix(in srgb, var(--accent) 15%, var(--border));
  }

  .ps-nav-link {
    display: flex;
    flex-direction: column;
    gap: 0.2em;
    padding: 0.65em 1.1em;
    text-decoration: none;
    transition: background 0.15s;
  }
  .ps-nav-link:hover { background: color-mix(in srgb, var(--accent) 8%, var(--entry)); }

  .ps-nav-link.next {
    text-align: right;
    border-left: 1px solid color-mix(in srgb, var(--accent) 15%, var(--border));
  }

  .ps-nav-dir {
    font-size: 0.7em;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--accent);
  }

  .ps-nav-title {
    font-size: 0.8em;
    color: var(--primary);
    line-height: 1.35;
  }
</style>

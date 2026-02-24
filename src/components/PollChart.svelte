<script lang="ts">
  import { onMount } from 'svelte';

  interface Response {
    label: string;
    pct: number;
    count?: number;
    color?: string;   // CSS color override for this bar
  }

  interface MetaItem {
    text: string;
    url?: string;
  }

  interface Props {
    question: string;
    responses: Response[];
    source?: string;
    sourceUrl?: string;
    n?: number | string;
    date?: string;
    margin?: number;       // margin of error e.g. 3 → ±3%
    multiSelect?: boolean; // show "may total >100%" note
    sorted?: boolean;      // default true — sort bars by pct desc
  }

  let {
    question,
    responses,
    source,
    sourceUrl,
    n,
    date,
    margin,
    multiSelect = false,
    sorted = true,
  }: Props = $props();

  let ready = $state(false);
  onMount(() => { requestAnimationFrame(() => { ready = true; }); });

  let displayed = $derived(
    sorted ? [...responses].sort((a, b) => b.pct - a.pct) : responses
  );

  let maxPct = $derived(Math.max(...responses.map(r => r.pct)));

  function fmt(val: number | string): string {
    return typeof val === 'number' ? val.toLocaleString() : val;
  }

  let metaItems = $derived.by((): MetaItem[] => {
    const items: MetaItem[] = [];
    if (source) items.push({ text: source, url: sourceUrl });
    if (n !== undefined) items.push({ text: `n = ${fmt(n)}` });
    if (margin !== undefined) items.push({ text: `±${margin}% MoE` });
    if (date) items.push({ text: date });
    return items;
  });
</script>

<figure class="poll-chart">
  <div class="pc-header">
    <span class="pc-icon" aria-hidden="true">◎</span>
    <p class="pc-question">{question}</p>
  </div>

  <div class="pc-bars">
    {#each displayed as r, i}
      <div class="pc-row">
        <span class="pc-label" title={r.label}>{r.label}</span>
        <div
          class="pc-track"
          role="progressbar"
          aria-valuenow={r.pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="{r.label}: {r.pct}%"
        >
          <div
            class="pc-fill"
            class:leader={r.pct === maxPct && !r.color}
            style="
              width: {ready ? r.pct + '%' : '0%'};
              transition: width 0.55s ease-out {i * 0.06}s;
              {r.color ? `background: ${r.color};` : ''}
            "
          ></div>
        </div>
        <span class="pc-pct">
          {r.pct}%{#if r.count !== undefined}<span class="pc-count"> ({fmt(r.count)})</span>{/if}
        </span>
      </div>
    {/each}
  </div>

  {#if multiSelect || metaItems.length > 0}
    <div class="pc-footer">
      {#if multiSelect}
        <p class="pc-note">Respondents could select multiple answers · totals may exceed 100%</p>
      {/if}
      {#if metaItems.length > 0}
        <p class="pc-meta">
          {#each metaItems as item, i}
            {#if i > 0}<span class="pc-sep"> · </span>{/if}
            {#if item.url}
              <a href={item.url} target="_blank" rel="noopener noreferrer">{item.text}</a>
            {:else}
              <span>{item.text}</span>
            {/if}
          {/each}
        </p>
      {/if}
    </div>
  {/if}
</figure>

<style>
  .poll-chart {
    margin: 1.75em 0;
    background: var(--entry);
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
    font-family: var(--font-sans);
  }

  /* ── header ── */
  .pc-header {
    display: flex;
    align-items: flex-start;
    gap: 0.6em;
    padding: 0.85em 1.2em;
    background: color-mix(in srgb, var(--accent) 8%, var(--entry));
    border-bottom: 1px solid var(--border);
  }

  .pc-icon {
    font-size: 1.1em;
    color: var(--accent);
    flex-shrink: 0;
    margin-top: 0.1em;
    line-height: 1;
  }

  .pc-question {
    margin: 0;
    font-size: 0.92em;
    font-weight: 600;
    font-family: var(--font-serif);
    color: var(--primary);
    line-height: 1.45;
  }

  /* ── bars ── */
  .pc-bars {
    padding: 0.85em 1.2em;
    display: flex;
    flex-direction: column;
    gap: 0.65em;
  }

  .pc-row {
    display: grid;
    grid-template-columns: minmax(0, 180px) 1fr 4.5em;
    align-items: center;
    gap: 0.75em;
  }

  .pc-label {
    font-size: 0.82em;
    color: var(--content);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .pc-track {
    height: 20px;
    background: color-mix(in srgb, var(--accent) 10%, var(--entry));
    border: 1px solid color-mix(in srgb, var(--accent) 15%, var(--border));
    border-radius: 4px;
    overflow: hidden;
  }

  .pc-fill {
    height: 100%;
    border-radius: 4px;
    background: color-mix(in srgb, var(--accent) 45%, var(--border));
  }

  .pc-fill.leader {
    background: var(--accent);
  }

  .pc-pct {
    font-size: 0.82em;
    font-weight: 600;
    color: var(--primary);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    text-align: right;
  }

  .pc-count {
    font-weight: 400;
    color: var(--secondary);
  }

  /* ── footer ── */
  .pc-footer {
    padding: 0.5em 1.2em 0.65em;
    border-top: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 0.2em;
  }

  .pc-note {
    margin: 0;
    font-size: 0.72em;
    color: var(--secondary);
    font-style: italic;
  }

  .pc-meta {
    margin: 0;
    font-size: 0.72em;
    color: var(--secondary);
  }

  .pc-meta a {
    color: var(--link);
    text-decoration: none;
  }
  .pc-meta a:hover { text-decoration: underline; }

  .pc-sep { color: var(--tertiary); }

  @media (max-width: 480px) {
    .pc-row {
      grid-template-columns: minmax(0, 110px) 1fr 3.5em;
      gap: 0.5em;
    }
  }
</style>

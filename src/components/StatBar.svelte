<script lang="ts">
  import { onMount } from 'svelte';

  interface BarItem {
    label: string;
    value: number;
    max?: number;    // per-item override; superseded by globalMax
    color?: string;  // CSS color string
    note?: string;   // small annotation below the bar
  }

  interface Props {
    items: BarItem[];
    title?: string;
    unit?: string;       // appended to value, e.g. "%" or " pts"
    globalMax?: number;  // normalise all bars to the same scale
    showValues?: boolean;
  }

  let {
    items,
    title,
    unit = '',
    globalMax,
    showValues = true,
  }: Props = $props();

  let ready = $state(false);
  onMount(() => requestAnimationFrame(() => { ready = true; }));

  function pct(item: BarItem) {
    const max = globalMax ?? item.max ?? 100;
    return Math.min(100, Math.max(0, (item.value / max) * 100));
  }

  function fmt(v: number) {
    return Number.isInteger(v) ? String(v) : v.toFixed(1);
  }
</script>

<div class="statbar">
  {#if title}
    <p class="sb-title">{title}</p>
  {/if}

  {#each items as item}
    <div class="sb-item">
      <div class="sb-row">
        <span class="sb-label">{item.label}</span>
        <div class="sb-track" role="meter" aria-valuenow={item.value} aria-label={item.label}>
          <div
            class="sb-fill"
            style="width: {ready ? pct(item) : 0}%;{item.color ? ` background: ${item.color};` : ''}"
          ></div>
        </div>
        {#if showValues}
          <span class="sb-value">{fmt(item.value)}{unit}</span>
        {/if}
      </div>
      {#if item.note}
        <p class="sb-note">{item.note}</p>
      {/if}
    </div>
  {/each}
</div>

<style>
  .statbar {
    margin: 1.5em 0;
    font-family: var(--font-sans);
    display: flex;
    flex-direction: column;
    gap: 0.65em;
  }

  .sb-title {
    margin: 0 0 0.4em;
    font-size: 0.78em;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--secondary);
  }

  .sb-item {
    display: flex;
    flex-direction: column;
    gap: 0.18em;
  }

  .sb-row {
    display: flex;
    align-items: center;
    gap: 0.75em;
  }

  .sb-label {
    flex: 0 0 140px;
    font-size: 0.82em;
    color: var(--primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .sb-track {
    flex: 1;
    height: 10px;
    background: color-mix(in srgb, var(--accent) 10%, var(--entry));
    border-radius: 999px;
    overflow: hidden;
    position: relative;
  }

  .sb-fill {
    height: 100%;
    border-radius: 999px;
    background: var(--accent);
    transition: width 0.7s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .sb-value {
    flex: 0 0 3.5em;
    text-align: right;
    font-size: 0.8em;
    font-weight: 600;
    color: var(--secondary);
    font-variant-numeric: tabular-nums;
  }

  .sb-note {
    margin: 0;
    padding-left: calc(140px + 0.75em);
    font-size: 0.74em;
    color: var(--tertiary);
    font-style: italic;
    line-height: 1.4;
  }

  @media (max-width: 480px) {
    .sb-label { flex: 0 0 100px; }
    .sb-note { padding-left: calc(100px + 0.75em); }
  }
</style>

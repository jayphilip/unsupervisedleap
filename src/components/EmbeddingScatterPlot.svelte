<script lang="ts">
  import { onMount } from 'svelte';

  interface Point {
    id: string;
    label: string;
    x: number;   // 2D projection coordinate [-1, 1]
    y: number;
    recipe: string;
    color: string;
  }

  interface Props {
    points: Point[];
    title?: string;
    caption?: string;
    width?: number;
    height?: number;
    showLegend?: boolean;
    legendItems?: { label: string; color: string }[];
  }

  let {
    points,
    title,
    caption,
    width = 600,
    height = 480,
    showLegend = true,
    legendItems = [],
  }: Props = $props();

  // SVG padding
  const PAD = { top: 30, right: 30, bottom: 50, left: 50 };
  const W = width - PAD.left - PAD.right;
  const H = height - PAD.top - PAD.bottom;

  // Scale from data coords [-1.2, 1.2] to SVG pixels
  function scaleX(v: number) {
    return ((v + 1.2) / 2.4) * W;
  }
  function scaleY(v: number) {
    return H - ((v + 1.2) / 2.4) * H;
  }

  let tooltip = $state<{ visible: boolean; x: number; y: number; point: Point | null }>({
    visible: false,
    x: 0,
    y: 0,
    point: null,
  });

  let hovered = $state<string | null>(null);
  let svgEl = $state<SVGSVGElement | null>(null);
  let ready = $state(false);

  onMount(() => {
    ready = true;
  });

  function handleMouseEnter(e: MouseEvent, p: Point) {
    hovered = p.id;
    const rect = (e.currentTarget as SVGElement).closest('svg')!.getBoundingClientRect();
    tooltip = {
      visible: true,
      x: e.clientX - rect.left + 12,
      y: e.clientY - rect.top - 10,
      point: p,
    };
  }

  function handleMouseLeave() {
    hovered = null;
    tooltip = { visible: false, x: 0, y: 0, point: null };
  }

  function handleMouseMove(e: MouseEvent) {
    if (!tooltip.visible) return;
    const rect = (e.currentTarget as SVGElement).getBoundingClientRect();
    tooltip.x = e.clientX - rect.left + 12;
    tooltip.y = e.clientY - rect.top - 10;
  }

  // Axis ticks
  const xTicks = [-1, -0.5, 0, 0.5, 1];
  const yTicks = [-1, -0.5, 0, 0.5, 1];
</script>

<figure class="embed-plot">
  {#if title}
    <p class="embed-title">{title}</p>
  {/if}

  <div class="embed-wrap">
    <svg
      bind:this={svgEl}
      viewBox="0 0 {width} {height}"
      role="img"
      aria-label={title ?? 'Ingredient embedding space'}
      onmousemove={handleMouseMove}
      onmouseleave={handleMouseLeave}
    >
      <g transform="translate({PAD.left},{PAD.top})">

        <!-- Grid lines -->
        {#each yTicks as t}
          <line
            x1={0} y1={scaleY(t)}
            x2={W} y2={scaleY(t)}
            class="grid-line"
          />
        {/each}
        {#each xTicks as t}
          <line
            x1={scaleX(t)} y1={0}
            x2={scaleX(t)} y2={H}
            class="grid-line"
          />
        {/each}

        <!-- Axes -->
        <line x1={0} y1={H/2} x2={W} y2={H/2} class="axis" />
        <line x1={W/2} y1={0} x2={W/2} y2={H} class="axis" />

        <!-- Axis tick labels -->
        {#each xTicks as t}
          {#if t !== 0}
            <text x={scaleX(t)} y={H + 18} class="tick-label" text-anchor="middle">{t}</text>
          {/if}
        {/each}
        {#each yTicks as t}
          {#if t !== 0}
            <text x={-8} y={scaleY(t) + 4} class="tick-label" text-anchor="end">{t}</text>
          {/if}
        {/each}

        <!-- Axis labels -->
        <text x={W/2} y={H + 40} class="axis-label" text-anchor="middle">UMAP 1</text>
        <text
          x={-H/2} y={-36}
          class="axis-label"
          text-anchor="middle"
          transform="rotate(-90)"
        >UMAP 2</text>

        <!-- Points -->
        {#each points as p}
          {@const cx = scaleX(p.x)}
          {@const cy = scaleY(p.y)}
          {@const isHovered = hovered === p.id}
          <g
            class="point-group"
            onmouseenter={(e) => handleMouseEnter(e, p)}
            onmouseleave={handleMouseLeave}
            role="img"
            aria-label="{p.label} ({p.recipe})"
          >
            <circle
              cx={cx} cy={cy}
              r={isHovered ? 9 : 6}
              fill={p.color}
              opacity={ready ? (hovered && !isHovered ? 0.35 : 0.88) : 0}
              class="point"
              style="transition: r 0.15s, opacity 0.2s, transform 0.2s; transform-origin: {cx}px {cy}px; transform: scale({ready ? 1 : 0})"
            />
            {#if isHovered}
              <circle
                cx={cx} cy={cy}
                r={13}
                fill="none"
                stroke={p.color}
                stroke-width="1.5"
                opacity="0.4"
              />
            {/if}
          </g>
        {/each}

      </g>
    </svg>

    <!-- Tooltip -->
    {#if tooltip.visible && tooltip.point}
      <div
        class="tooltip"
        style="left: {tooltip.x}px; top: {tooltip.y}px;"
      >
        <span class="tt-ingredient">{tooltip.point.label}</span>
        <span class="tt-recipe" style="background: {tooltip.point.color}20; color: {tooltip.point.color};">{tooltip.point.recipe}</span>
      </div>
    {/if}
  </div>

  <!-- Legend -->
  {#if showLegend && legendItems.length > 0}
    <div class="legend">
      {#each legendItems as item}
        <span class="legend-item">
          <span class="legend-dot" style="background: {item.color};"></span>
          {item.label}
        </span>
      {/each}
    </div>
  {/if}

  {#if caption}
    <figcaption class="embed-caption">{caption}</figcaption>
  {/if}
</figure>

<style>
  .embed-plot {
    margin: 2em 0;
    font-family: var(--font-sans);
  }

  .embed-title {
    margin: 0 0 0.5em;
    font-size: 0.82em;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--secondary);
  }

  .embed-wrap {
    position: relative;
    width: 100%;
  }

  svg {
    width: 100%;
    height: auto;
    display: block;
    background: var(--entry);
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: visible;
  }

  .grid-line {
    stroke: var(--border);
    stroke-width: 1;
  }

  .axis {
    stroke: color-mix(in srgb, var(--secondary) 40%, transparent);
    stroke-width: 1;
  }

  .tick-label {
    font-size: 11px;
    fill: var(--secondary);
    font-family: var(--font-mono, monospace);
  }

  .axis-label {
    font-size: 11px;
    fill: var(--secondary);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-family: var(--font-sans);
  }

  .point {
    cursor: pointer;
  }

  .tooltip {
    position: absolute;
    pointer-events: none;
    background: var(--entry);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 0.45em 0.75em;
    display: flex;
    flex-direction: column;
    gap: 0.2em;
    box-shadow: 0 4px 16px rgba(0,0,0,0.12);
    z-index: 10;
    min-width: 120px;
  }

  .tt-ingredient {
    font-size: 0.82em;
    font-weight: 700;
    color: var(--primary);
  }

  .tt-recipe {
    font-size: 0.72em;
    font-weight: 600;
    padding: 0.1em 0.45em;
    border-radius: 4px;
    align-self: flex-start;
  }

  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5em 1.2em;
    margin-top: 0.9em;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.4em;
    font-size: 0.8em;
    color: var(--secondary);
  }

  .legend-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .embed-caption {
    margin: 0.6em 0 0;
    font-size: 0.8em;
    color: var(--tertiary);
    font-style: italic;
    line-height: 1.5;
    text-align: center;
  }
</style>

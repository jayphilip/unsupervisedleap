<script lang="ts">
  interface Props {
    name: string;
    provider: string;
    version?: string;
    params?: string;         // e.g. "70B", "405B", "~1.8T (MoE)"
    contextWindow?: string;  // e.g. "128k", "1M"
    released?: string;       // e.g. "2024-Q2"
    license?: string;        // e.g. "Apache 2.0", "Proprietary"
    modalities?: string[];   // e.g. ["text", "vision", "code"]
    strengths?: string[];
    weaknesses?: string[];
    url?: string;
    logo?: string;
  }

  let {
    name, provider, version, params, contextWindow,
    released, license, modalities, strengths, weaknesses,
    url, logo,
  }: Props = $props();

  const hasMeta = params || contextWindow || released || license;
</script>

<figure class="model-card">
  <div class="mc-header">
    {#if logo}
      <img src={logo} alt="{provider} logo" class="mc-logo" />
    {/if}
    <div class="mc-name-block">
      {#if url}
        <a href={url} target="_blank" rel="noopener noreferrer" class="mc-name">{name}{version ? ` ${version}` : ''}</a>
      {:else}
        <span class="mc-name">{name}{version ? ` ${version}` : ''}</span>
      {/if}
      <span class="mc-provider">{provider}</span>
    </div>
  </div>

  {#if hasMeta}
    <dl class="mc-meta">
      {#if params}
        <div class="mc-stat">
          <dt>Parameters</dt>
          <dd>{params}</dd>
        </div>
      {/if}
      {#if contextWindow}
        <div class="mc-stat">
          <dt>Context</dt>
          <dd>{contextWindow}</dd>
        </div>
      {/if}
      {#if released}
        <div class="mc-stat">
          <dt>Released</dt>
          <dd>{released}</dd>
        </div>
      {/if}
      {#if license}
        <div class="mc-stat">
          <dt>License</dt>
          <dd>{license}</dd>
        </div>
      {/if}
    </dl>
  {/if}

  {#if modalities && modalities.length > 0}
    <div class="mc-modalities">
      {#each modalities as m}
        <span class="mc-pill">{m}</span>
      {/each}
    </div>
  {/if}

  {#if (strengths && strengths.length > 0) || (weaknesses && weaknesses.length > 0)}
    <div class="mc-sw">
      {#if strengths && strengths.length > 0}
        <div class="mc-col">
          <p class="mc-col-label strengths">Strengths</p>
          <ul>
            {#each strengths as s}<li>{s}</li>{/each}
          </ul>
        </div>
      {/if}
      {#if weaknesses && weaknesses.length > 0}
        <div class="mc-col">
          <p class="mc-col-label weaknesses">Weaknesses</p>
          <ul>
            {#each weaknesses as w}<li>{w}</li>{/each}
          </ul>
        </div>
      {/if}
    </div>
  {/if}
</figure>

<style>
  .model-card {
    margin: 1.75em 0;
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
    background: var(--entry);
    font-family: var(--font-sans);
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
  }

  .model-card:hover {
    border-color: var(--tertiary);
    box-shadow: 0 4px 18px rgba(0,0,0,0.1);
  }

  /* Header */
  .mc-header {
    display: flex;
    align-items: center;
    gap: 0.85em;
    padding: 1em 1.25em;
    border-bottom: 1px solid var(--border);
    background: color-mix(in srgb, var(--accent) 6%, var(--entry));
  }

  .mc-logo {
    width: 32px;
    height: 32px;
    object-fit: contain;
    border-radius: 6px;
    flex-shrink: 0;
  }

  .mc-name-block {
    display: flex;
    flex-direction: column;
    gap: 0.1em;
  }

  .mc-name {
    font-size: 1em;
    font-weight: 700;
    font-family: var(--font-serif);
    color: var(--primary);
    text-decoration: none;
    line-height: 1.2;
  }

  a.mc-name:hover { color: var(--link); }

  .mc-provider {
    font-size: 0.75em;
    color: var(--secondary);
    font-weight: 500;
  }

  /* Meta grid */
  .mc-meta {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 0;
    border-bottom: 1px solid var(--border);
    margin: 0;
    padding: 0;
  }

  .mc-stat {
    padding: 0.65em 1.25em;
    border-right: 1px solid var(--border);
  }

  .mc-stat:last-child { border-right: none; }

  .mc-stat dt {
    font-size: 0.67em;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--secondary);
    margin-bottom: 0.2em;
  }

  .mc-stat dd {
    margin: 0;
    font-size: 0.88em;
    font-weight: 700;
    color: var(--primary);
    font-variant-numeric: tabular-nums;
  }

  /* Modality pills */
  .mc-modalities {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4em;
    padding: 0.7em 1.25em;
    border-bottom: 1px solid var(--border);
  }

  .mc-pill {
    font-size: 0.68em;
    padding: 0.18em 0.6em;
    border-radius: 999px;
    background: color-mix(in srgb, var(--accent) 12%, var(--entry));
    color: var(--accent);
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  /* Strengths / Weaknesses */
  .mc-sw {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
  }

  .mc-col {
    padding: 0.8em 1.25em;
  }

  .mc-col:first-child {
    border-right: 1px solid var(--border);
  }

  .mc-col-label {
    margin: 0 0 0.5em;
    font-size: 0.7em;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
  }

  .mc-col-label.strengths { color: #22c55e; }
  .mc-col-label.weaknesses { color: #f87171; }

  .mc-col ul {
    margin: 0;
    padding-left: 1.1em;
    display: flex;
    flex-direction: column;
    gap: 0.25em;
  }

  .mc-col ul li {
    font-size: 0.8em;
    color: var(--content);
    line-height: 1.45;
  }

  @media (max-width: 500px) {
    .mc-sw { grid-template-columns: 1fr; }
    .mc-col:first-child { border-right: none; border-bottom: 1px solid var(--border); }
  }
</style>

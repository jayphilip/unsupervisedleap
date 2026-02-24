<script lang="ts">
  interface Props {
    term: string;
    formal?: string;      // precise / technical definition
    plain?: string;       // your plain-English gloss
    source?: string;      // citation or attribution
    sourceUrl?: string;
  }

  let { term, formal, plain, source, sourceUrl }: Props = $props();
</script>

<div class="def-block">
  <div class="def-term-row">
    <span class="def-term">{term}</span>
    <span class="def-rule" aria-hidden="true"></span>
  </div>

  {#if formal}
    <p class="def-formal">{formal}</p>
  {/if}

  {#if plain}
    <div class="def-plain">
      <span class="def-plain-label">In plain terms</span>
      <p class="def-plain-text">{plain}</p>
    </div>
  {/if}

  {#if source}
    <p class="def-source">
      {#if sourceUrl}
        — <a href={sourceUrl} target="_blank" rel="noopener noreferrer">{source}</a>
      {:else}
        — {source}
      {/if}
    </p>
  {/if}
</div>

<style>
  .def-block {
    margin: 1.75em 0;
    border-left: 3px solid var(--accent);
    padding: 0.9em 0 0.9em 1.25em;
    font-family: var(--font-sans);
  }

  .def-term-row {
    display: flex;
    align-items: center;
    gap: 0.75em;
    margin-bottom: 0.55em;
  }

  .def-term {
    font-size: 1em;
    font-weight: 800;
    font-family: var(--font-serif);
    font-style: italic;
    color: var(--accent);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .def-rule {
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  .def-formal {
    margin: 0 0 0.65em;
    font-size: 0.88em;
    color: var(--primary);
    line-height: 1.65;
    font-style: italic;
  }

  .def-plain {
    background: color-mix(in srgb, var(--accent) 7%, var(--entry));
    border-radius: 6px;
    padding: 0.6em 0.85em;
    margin-top: 0.5em;
    display: flex;
    flex-direction: column;
    gap: 0.25em;
  }

  .def-plain-label {
    font-size: 0.65em;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    color: var(--accent);
  }

  .def-plain-text {
    margin: 0;
    font-size: 0.85em;
    color: var(--content);
    line-height: 1.6;
  }

  .def-source {
    margin: 0.6em 0 0;
    font-size: 0.75em;
    color: var(--secondary);
    font-style: italic;
  }

  .def-source a {
    color: var(--link);
    text-decoration: none;
  }

  .def-source a:hover {
    text-decoration: underline;
  }
</style>

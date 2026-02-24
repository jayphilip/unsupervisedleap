<script lang="ts">
  interface Props {
    title: string;
    children?: import('svelte').Snippet;
    question?: string;     // the key question posed at the end
    origin?: string;       // e.g. "Judith Jarvis Thomson, 1976"
    originUrl?: string;
  }

  let { title, children, question, origin, originUrl }: Props = $props();
</script>

<figure class="thought-experiment">
  <div class="te-header">
    <span class="te-label" aria-label="Thought experiment">⟐</span>
    <p class="te-title">{title}</p>
  </div>

  <div class="te-body">
    {@render children?.()}
  </div>

  {#if question}
    <div class="te-question">
      <span class="te-q-mark">?</span>
      <p class="te-q-text">{question}</p>
    </div>
  {/if}

  {#if origin}
    <p class="te-origin">
      {#if originUrl}
        <a href={originUrl} target="_blank" rel="noopener noreferrer">{origin}</a>
      {:else}
        {origin}
      {/if}
    </p>
  {/if}
</figure>

<style>
  .thought-experiment {
    margin: 1.75em 0;
    background: color-mix(in srgb, var(--accent) 5%, var(--entry));
    border: 1px solid color-mix(in srgb, var(--accent) 22%, var(--border));
    border-radius: 10px;
    overflow: hidden;
    font-family: var(--font-sans);
  }

  .te-header {
    display: flex;
    align-items: center;
    gap: 0.65em;
    padding: 0.7em 1.2em;
    background: color-mix(in srgb, var(--accent) 10%, var(--entry));
    border-bottom: 1px solid color-mix(in srgb, var(--accent) 18%, var(--border));
  }

  .te-label {
    font-size: 1.1em;
    color: var(--accent);
    flex-shrink: 0;
    line-height: 1;
  }

  .te-title {
    margin: 0;
    font-size: 0.82em;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--accent);
  }

  .te-body {
    padding: 1.1em 1.25em;
    font-size: 0.9em;
    color: var(--content);
    line-height: 1.7;
  }

  /* Strip margins from any markdown paragraphs rendered inside */
  .te-body :global(p) {
    margin: 0 0 0.75em;
  }
  .te-body :global(p:last-child) {
    margin-bottom: 0;
  }

  .te-question {
    display: flex;
    align-items: baseline;
    gap: 0.7em;
    padding: 0.8em 1.25em;
    border-top: 1px solid color-mix(in srgb, var(--accent) 18%, var(--border));
    background: color-mix(in srgb, var(--accent) 8%, var(--entry));
  }

  .te-q-mark {
    font-size: 1.3em;
    font-weight: 900;
    color: var(--accent);
    flex-shrink: 0;
    line-height: 1;
    font-family: var(--font-serif);
  }

  .te-q-text {
    margin: 0;
    font-size: 0.9em;
    font-weight: 700;
    font-family: var(--font-serif);
    font-style: italic;
    color: var(--primary);
    line-height: 1.45;
  }

  .te-origin {
    margin: 0;
    padding: 0.45em 1.25em 0.6em;
    font-size: 0.72em;
    color: var(--secondary);
    font-style: italic;
    border-top: 1px solid var(--border);
  }

  .te-origin a {
    color: var(--link);
    text-decoration: none;
  }
  .te-origin a:hover { text-decoration: underline; }
</style>

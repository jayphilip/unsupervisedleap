<script lang="ts">
  interface Props {
    title: string;
    authors: string[];
    venue?: string;       // e.g. "NeurIPS 2024", "arXiv", "Nature"
    year?: number | string;
    abstract?: string;    // excerpt shown on the card
    tldr?: string;        // your plain-English one-liner
    url?: string;
    doi?: string;
    tags?: string[];
  }

  let { title, authors, venue, year, abstract, tldr, url, doi, tags }: Props = $props();

  // Truncate abstract to ~280 chars
  const abstractShort = abstract && abstract.length > 280
    ? abstract.slice(0, 280).trimEnd() + '…'
    : abstract;

  const href = url ?? (doi ? `https://doi.org/${doi}` : undefined);

  function formatAuthors(a: string[]) {
    if (a.length <= 3) return a.join(', ');
    return a.slice(0, 3).join(', ') + ` +${a.length - 3} more`;
  }
</script>

<figure class="abstract-card">
  <div class="ac-stripe"></div>

  <div class="ac-body">
    <div class="ac-header">
      <div class="ac-title-block">
        {#if href}
          <a {href} target="_blank" rel="noopener noreferrer" class="ac-title">{title}</a>
        {:else}
          <p class="ac-title">{title}</p>
        {/if}
        <p class="ac-authors">{formatAuthors(authors)}</p>
      </div>
      <div class="ac-meta">
        {#if venue}<span class="ac-venue">{venue}</span>{/if}
        {#if year}<span class="ac-year">{year}</span>{/if}
      </div>
    </div>

    {#if tags && tags.length > 0}
      <div class="ac-tags">
        {#each tags as tag}
          <span class="ac-tag">{tag}</span>
        {/each}
      </div>
    {/if}

    {#if abstractShort}
      <p class="ac-abstract">{abstractShort}</p>
    {/if}

    {#if tldr}
      <div class="ac-tldr">
        <span class="ac-tldr-label">TL;DR</span>
        <span class="ac-tldr-text">{tldr}</span>
      </div>
    {/if}

    {#if href}
      <a {href} target="_blank" rel="noopener noreferrer" class="ac-link">
        Read paper →
      </a>
    {/if}
  </div>
</figure>

<style>
  .abstract-card {
    margin: 1.75em 0;
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
    background: var(--entry);
    font-family: var(--font-sans);
    display: flex;
    flex-direction: row;
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
  }

  .abstract-card:hover {
    border-color: var(--tertiary);
    box-shadow: 0 4px 18px rgba(0,0,0,0.1);
  }

  /* Left accent stripe */
  .ac-stripe {
    width: 4px;
    flex-shrink: 0;
    background: var(--accent);
    border-radius: 0;
  }

  .ac-body {
    padding: 1.1em 1.3em;
    display: flex;
    flex-direction: column;
    gap: 0.6em;
    flex: 1;
    min-width: 0;
  }

  .ac-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.75em;
  }

  .ac-title-block {
    flex: 1;
    min-width: 0;
  }

  .ac-title {
    margin: 0;
    font-size: 0.95em;
    font-weight: 700;
    font-family: var(--font-serif);
    color: var(--primary);
    line-height: 1.35;
    text-decoration: none;
  }

  a.ac-title:hover { color: var(--link); text-decoration: underline; }

  .ac-authors {
    margin: 0.25em 0 0;
    font-size: 0.77em;
    color: var(--secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ac-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.2em;
    flex-shrink: 0;
  }

  .ac-venue {
    font-size: 0.72em;
    font-weight: 700;
    color: var(--accent);
    white-space: nowrap;
    text-align: right;
  }

  .ac-year {
    font-size: 0.72em;
    color: var(--secondary);
  }

  .ac-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35em;
  }

  .ac-tag {
    font-size: 0.68em;
    padding: 0.18em 0.6em;
    border-radius: 999px;
    background: color-mix(in srgb, var(--accent) 10%, var(--entry));
    color: var(--accent);
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  .ac-abstract {
    margin: 0;
    font-size: 0.82em;
    color: var(--content);
    line-height: 1.65;
  }

  .ac-tldr {
    display: flex;
    gap: 0.55em;
    align-items: baseline;
    background: color-mix(in srgb, var(--accent) 7%, var(--entry));
    border-radius: 6px;
    padding: 0.5em 0.8em;
  }

  .ac-tldr-label {
    font-size: 0.68em;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--accent);
    flex-shrink: 0;
  }

  .ac-tldr-text {
    font-size: 0.82em;
    color: var(--primary);
    font-style: italic;
    line-height: 1.5;
  }

  .ac-link {
    font-size: 0.78em;
    font-weight: 600;
    color: var(--link);
    text-decoration: none;
    letter-spacing: 0.01em;
    align-self: flex-start;
  }

  .ac-link:hover {
    color: var(--link-hover);
    text-decoration: underline;
  }
</style>

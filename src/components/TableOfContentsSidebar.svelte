<script lang="ts">
  interface Heading {
    depth: number;
    slug: string;
    text: string;
  }

  interface Props {
    headings: Heading[];
  }

  let { headings }: Props = $props();

  const filtered = headings.filter((h) => h.depth >= 2 && h.depth <= 3);

  let activeSlug = $state('');

  $effect(() => {
    if (filtered.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activeSlug = entry.target.id;
          }
        }
      },
      { rootMargin: '-20% 0% -70% 0%', threshold: 0 }
    );

    const elements = filtered
      .map((h) => document.getElementById(h.slug))
      .filter(Boolean) as HTMLElement[];

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  });
</script>

{#if filtered.length > 0}
  <nav class="toc-sidebar" aria-label="Table of contents">
    <p class="toc-sidebar-title">On This Page</p>
    <ul class="toc-sidebar-list">
      {#each filtered as heading}
        <li class={`toc-sidebar-item toc-sidebar-depth-${heading.depth}`}>
          <a
            href={`#${heading.slug}`}
            class={activeSlug === heading.slug ? 'active' : ''}
          >
            {heading.text}
          </a>
        </li>
      {/each}
    </ul>
  </nav>
{/if}

<style>
  .toc-sidebar {
    position: sticky;
    top: 80px;
    max-height: calc(100vh - 100px);
    overflow-y: auto;
    padding: 0;
  }

  .toc-sidebar-title {
    font-family: var(--font-sans);
    font-size: 0.72em;
    font-weight: 600;
    color: var(--secondary);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin: 0 0 0.85em;
    padding: 0;
  }

  .toc-sidebar-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .toc-sidebar-item a {
    display: block;
    font-family: var(--font-sans);
    font-size: 0.82em;
    color: var(--secondary);
    text-decoration: none;
    line-height: 1.4;
    padding: 0.28em 0;
    padding-left: 0.75em;
    border-left: 2px solid transparent;
    transition: color 0.15s ease, border-color 0.15s ease;
  }

  .toc-sidebar-item a:hover {
    color: var(--primary);
    border-left-color: var(--border);
  }

  .toc-sidebar-item a.active {
    color: var(--accent);
    border-left-color: var(--accent);
    font-weight: 500;
  }

  .toc-sidebar-depth-3 a {
    padding-left: 1.5em;
    font-size: 0.78em;
  }
</style>

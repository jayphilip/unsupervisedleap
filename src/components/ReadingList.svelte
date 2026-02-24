<script lang="ts">
  interface BookData {
    title: string;
    author: string;
    year?: number | string;
    cover?: string;
    genre?: string;
    rating?: number;
    take?: string;
    url?: string;
    spineColor?: string;
  }

  interface Props {
    books: BookData[];
    title?: string;
    intro?: string;
  }

  let { books, title, intro }: Props = $props();

  const stars = (rating: number = 0) =>
    Math.min(5, Math.max(0, Math.round(rating)));

  const initials = (t: string) =>
    t.split(/\s+/).slice(0, 2).map((w: string) => w[0]).join('');
</script>

<section class="reading-list">
  {#if title}
    <h3 class="rl-title">{title}</h3>
  {/if}
  {#if intro}
    <p class="rl-intro">{intro}</p>
  {/if}

  <div class="rl-books">
    {#each books as book}
      <figure class="bc rl-card" style={book.spineColor ? `border-top-color: ${book.spineColor}` : ''}>
        <div class="bc-cover">
          {#if book.cover}
            <img src={book.cover} alt="Cover of {book.title}" loading="lazy" />
          {:else}
            <div class="cover-ph"><span>{initials(book.title)}</span></div>
          {/if}
        </div>
        <figcaption class="rl-meta">
          <div class="rl-meta-top">
            {#if book.genre}<span class="bc-tag">{book.genre}</span>{/if}
            {#if book.rating && stars(book.rating) > 0}
              <p class="bc-stars" aria-label="{book.rating} out of 5 stars">
                {#each {length: 5} as _, i}<span class:lit={i < stars(book.rating)}>★</span>{/each}
              </p>
            {/if}
          </div>
          {#if book.url}
            <a href={book.url} target="_blank" rel="noopener noreferrer" class="bc-title">{book.title}</a>
          {:else}
            <p class="bc-title">{book.title}</p>
          {/if}
          <p class="bc-author">{book.author}{book.year ? ` · ${book.year}` : ''}</p>
          {#if book.take}<p class="bc-take">{book.take}</p>{/if}
        </figcaption>
      </figure>
    {/each}
  </div>
</section>

<style>
  .reading-list {
    margin: 2em 0;
    font-family: var(--font-sans);
  }

  .rl-title {
    margin: 0 0 0.3em;
    font-size: 1.1em;
    font-weight: 700;
    font-family: var(--font-serif);
    color: var(--primary);
  }

  .rl-intro {
    margin: 0 0 1em;
    font-size: 0.88em;
    color: var(--secondary);
    line-height: 1.6;
  }

  .rl-books {
    display: flex;
    flex-direction: column;
    gap: 0.75em;
  }

  /* Shared with BookCard — reuse tokens */
  .bc {
    font-family: var(--font-sans);
    border-radius: 10px;
    overflow: hidden;
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
  }

  .rl-card {
    display: flex;
    flex-direction: row;
    background: var(--entry);
    border: 1px solid var(--border);
    border-top: 4px solid var(--accent);
    margin: 0;
  }

  .rl-card:hover {
    border-color: var(--accent);
    border-top-color: var(--accent);
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  }

  .bc-cover {
    flex-shrink: 0;
    width: 90px;
    overflow: hidden;
    border-right: 1px solid var(--border);
    align-self: flex-start;
  }

  .bc-cover img {
    width: 100%;
    height: auto;
    display: block;
    transition: transform 0.4s ease;
  }

  .rl-card:hover .bc-cover img {
    transform: scale(1.04);
  }

  .cover-ph {
    width: 100%;
    aspect-ratio: 2/3;
    display: flex;
    align-items: center;
    justify-content: center;
    background: color-mix(in srgb, var(--accent) 14%, var(--entry));
  }

  .cover-ph span {
    font-size: 1.8em;
    font-weight: 800;
    font-family: var(--font-serif);
    font-style: italic;
    color: var(--accent);
    opacity: 0.65;
  }

  .rl-meta {
    padding: 0.85em 1.1em;
    display: flex;
    flex-direction: column;
    gap: 0.3em;
    flex: 1;
    min-width: 0;
  }

  .rl-meta-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5em;
    margin-bottom: 0.1em;
  }

  .bc-title {
    margin: 0;
    font-size: 0.9em;
    font-weight: 700;
    font-family: var(--font-serif);
    color: var(--primary);
    line-height: 1.3;
    text-decoration: none;
  }

  a.bc-title:hover { color: var(--link); }

  .bc-author {
    margin: 0;
    font-size: 0.75em;
    color: var(--secondary);
  }

  .bc-tag {
    display: inline-block;
    font-size: 0.65em;
    padding: 0.15em 0.55em;
    border-radius: 999px;
    background: color-mix(in srgb, var(--accent) 12%, var(--entry));
    color: var(--accent);
    font-weight: 600;
    white-space: nowrap;
  }

  .bc-stars {
    margin: 0;
    padding: 0;
    font-size: 0.82em;
    letter-spacing: 0.06em;
    line-height: 1;
  }
  .bc-stars span { color: var(--tertiary); }
  .bc-stars span.lit { color: #f59e0b; }

  .bc-take {
    margin: 0.4em 0 0;
    font-size: 0.78em;
    color: var(--content);
    font-style: italic;
    line-height: 1.55;
    border-top: 1px solid var(--border);
    padding-top: 0.4em;
  }
</style>

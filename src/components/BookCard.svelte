<script lang="ts">
  interface Props {
    title: string;
    author: string;
    year?: number | string;
    cover?: string;
    genre?: string;
    rating?: number; // 1-5
    take?: string;
    url?: string;
    spineColor?: string;
  }

  let {
    title, author, year, cover, genre, rating = 0,
    take, url, spineColor
  }: Props = $props();

  const stars = Math.min(5, Math.max(0, Math.round(rating)));
  const initials = title.split(/\s+/).slice(0, 2).map((w: string) => w[0]).join('');
</script>

<figure class="bc spine-card">
  <div class="bc-cover">
    {#if cover}
      <img src={cover} alt="Cover of {title}" loading="lazy" />
    {:else}
      <div class="cover-ph"><span>{initials}</span></div>
    {/if}
  </div>
  <figcaption class="spine-meta">
    <div class="spine-meta-top">
      {#if genre}<span class="bc-tag">{genre}</span>{/if}
      {#if stars > 0}
        <p class="bc-stars" aria-label="{stars} out of 5 stars">
          {#each {length: 5} as _, i}<span class:lit={i < stars}>★</span>{/each}
        </p>
      {/if}
    </div>
    {#if url}
      <a href={url} target="_blank" rel="noopener noreferrer" class="bc-title">{title}</a>
    {:else}
      <h3 class="bc-title">{title}</h3>
    {/if}
    <p class="bc-author">{author}{year ? ` · ${year}` : ''}</p>
    {#if take}<p class="bc-take">{take}</p>{/if}
  </figcaption>
</figure>

<style>
  /* ─────────────────────────────────────────
     Shared base + typography tokens
  ───────────────────────────────────────── */
  .bc {
    margin: 1.75em 0;
    font-family: var(--font-sans);
    border-radius: 10px;
    overflow: hidden;
    transition: box-shadow 0.25s ease, border-color 0.25s ease;
  }

  .bc-title {
    margin: 0;
    font-size: 0.95em;
    font-weight: 700;
    font-family: var(--font-serif);
    color: var(--primary);
    line-height: 1.3;
    text-decoration: none;
  }

  a.bc-title:hover { color: var(--link); }

  .bc-author {
    margin: 0.2em 0 0;
    font-size: 0.78em;
    color: var(--secondary);
  }

  .bc-tag {
    display: inline-block;
    font-size: 0.68em;
    padding: 0.18em 0.6em;
    border-radius: 999px;
    background: color-mix(in srgb, var(--accent) 12%, var(--entry));
    color: var(--accent);
    font-weight: 600;
    white-space: nowrap;
    letter-spacing: 0.02em;
  }

  .bc-stars {
    margin: 0.3em 0 0;
    padding: 0;
    font-size: 0.88em;
    letter-spacing: 0.06em;
    line-height: 1;
  }
  .bc-stars span { color: var(--tertiary); }
  .bc-stars span.lit { color: #f59e0b; }

  .bc-take {
    margin: 0.5em 0 0;
    font-size: 0.82em;
    color: var(--content);
    font-style: italic;
    line-height: 1.6;
  }

  /* Cover placeholder */
  .cover-ph {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: color-mix(in srgb, var(--accent) 14%, var(--entry));
  }
  .cover-ph span {
    font-size: 2.2em;
    font-weight: 800;
    font-family: var(--font-serif);
    font-style: italic;
    color: var(--accent);
    opacity: 0.65;
  }


  /* ─────────────────────────────────────────
     SPINE (Option B — accent top bar)
  ───────────────────────────────────────── */
  .spine-card {
    display: flex;
    flex-direction: row;
    background: var(--entry);
    border: 1px solid var(--border);
    border-top: 4px solid var(--accent);
    border-radius: 10px;
  }

  .spine-card:hover {
    border-color: var(--accent);
    border-top-color: var(--accent);
    box-shadow: 0 4px 20px rgba(0,0,0,0.13);
  }

  /* Cover — full image always visible */
  .bc-cover {
    flex-shrink: 0;
    width: 130px;
    overflow: hidden;
    align-self: flex-start;
    border-right: 1px solid var(--border);
  }

  .bc-cover img {
    width: 100%;
    height: auto;
    display: block;
    transition: transform 0.4s ease;
  }

  .spine-card:hover .bc-cover img {
    transform: scale(1.04);
  }

  .spine-meta {
    padding: 1.1em 1.3em;
    display: flex;
    flex-direction: column;
    gap: 0.35em;
    flex: 1;
    min-width: 0;
  }

  .spine-meta-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5em;
    margin-bottom: 0.1em;
  }

  .spine-meta .bc-take {
    border-top: 1px solid var(--border);
    padding-top: 0.55em;
    margin-top: 0.2em;
  }
</style>
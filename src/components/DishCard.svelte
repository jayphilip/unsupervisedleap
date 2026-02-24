<script lang="ts">
  interface Props {
    name: string;
    heroImage: string;
    description?: string;
    prepTime?: string;
    cookTime?: string;
    serves?: number;
    origin?: string;
    extraImages?: { src: string; caption?: string }[];
  }

  let {
    name,
    heroImage,
    description,
    prepTime,
    cookTime,
    serves,
    origin,
    extraImages = [],
  }: Props = $props();

  const hasMeta = prepTime || cookTime || serves || origin;
</script>

<figure class="dish-card">

  <!-- Hero -->
  <div class="dish-hero">
    <img src={heroImage} alt={name} loading="lazy" />
    <div class="dish-hero-overlay">
      <h2 class="dish-name">{name}</h2>
      {#if hasMeta}
        <div class="dish-meta">
          {#if origin}<span class="dish-meta-item">{origin}</span>{/if}
          {#if prepTime}<span class="dish-meta-item">Prep {prepTime}</span>{/if}
          {#if cookTime}<span class="dish-meta-item">Cook {cookTime}</span>{/if}
          {#if serves}<span class="dish-meta-item">Serves {serves}</span>{/if}
        </div>
      {/if}
    </div>
  </div>

  {#if description}
    <figcaption class="dish-desc">{description}</figcaption>
  {/if}

  <!-- Extra images: masonry-style grid -->
  {#if extraImages.length > 0}
    <div class="dish-gallery" style="--col-count: {Math.min(extraImages.length, 3)}">
      {#each extraImages as img}
        <div class="dish-gallery-item">
          <img src={img.src} alt={img.caption ?? name} loading="lazy" />
          {#if img.caption}
            <span class="dish-gallery-caption">{img.caption}</span>
          {/if}
        </div>
      {/each}
    </div>
  {/if}

</figure>

<style>
  .dish-card {
    margin: 2.5em 0;
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    background: var(--entry);
    font-family: var(--font-sans);
  }

  /* ── Hero ── */
  .dish-hero {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 7;
    overflow: hidden;
    background: var(--tertiary);
  }

  .dish-hero img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.5s ease;
  }

  .dish-card:hover .dish-hero img {
    transform: scale(1.03);
  }

  .dish-hero-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 1.5em 1.75em;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.72) 0%,
      rgba(0, 0, 0, 0.28) 55%,
      transparent 100%
    );
  }

  .dish-name {
    margin: 0 0 0.35em;
    font-size: 1.65em;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.025em;
    line-height: 1.2;
    text-shadow: 0 1px 4px rgba(0,0,0,0.4);
  }

  .dish-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3em 0.75em;
  }

  .dish-meta-item {
    font-size: 0.78em;
    color: rgba(255, 255, 255, 0.82);
    font-weight: 500;
    letter-spacing: 0.01em;
  }

  .dish-meta-item + .dish-meta-item::before {
    content: '·';
    margin-right: 0.75em;
    opacity: 0.5;
  }

  /* ── Description ── */
  .dish-desc {
    display: block;
    padding: 1em 1.75em 1.1em;
    font-size: 0.92em;
    color: var(--secondary);
    line-height: 1.65;
    font-style: italic;
    border-bottom: 1px solid var(--border);
  }

  /* ── Gallery ── */
  .dish-gallery {
    display: grid;
    grid-template-columns: repeat(var(--col-count, 3), 1fr);
    gap: 3px;
    padding: 3px;
    /* simulate masonry by giving every other item a different row span */
  }

  /* Odd items (1st, 3rd…) get a taller row to create the stagger */
  .dish-gallery-item:nth-child(odd) {
    grid-row: span 2;
  }

  .dish-gallery-item {
    position: relative;
    overflow: hidden;
    background: var(--tertiary);
    min-height: 120px;
  }

  .dish-gallery-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.35s ease;
  }

  .dish-gallery-item:hover img {
    transform: scale(1.05);
  }

  .dish-gallery-caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0.4em 0.65em;
    font-size: 0.72em;
    color: rgba(255, 255, 255, 0.9);
    background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
    font-style: italic;
  }

  @media (max-width: 520px) {
    .dish-hero {
      aspect-ratio: 4 / 3;
    }

    .dish-name {
      font-size: 1.25em;
    }

    .dish-gallery {
      grid-template-columns: repeat(2, 1fr) !important;
    }
  }
</style>

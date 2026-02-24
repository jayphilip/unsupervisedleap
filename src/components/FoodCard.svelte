<script lang="ts">
  interface Props {
    name: string;
    image?: string;
    price?: string;
    origin?: string;
    store?: string;
    tags?: string[];
    notes?: string;
  }

  let {
    name,
    image,
    price,
    origin,
    store,
    tags = [],
    notes,
  }: Props = $props();
</script>

<figure class="food-card">
  {#if image}
    <div class="food-img-wrap">
      <img src={image} alt={name} loading="lazy" />
    </div>
  {/if}
  <figcaption class="food-body">
    <div class="food-header">
      <h3 class="food-name">{name}</h3>
      {#if price}
        <span class="food-price">{price}</span>
      {/if}
    </div>

    {#if origin || store}
      <p class="food-meta">
        {#if origin}<span>{origin}</span>{/if}
        {#if origin && store}<span class="sep">·</span>{/if}
        {#if store}<span>{store}</span>{/if}
      </p>
    {/if}

    {#if notes}
      <p class="food-notes">{notes}</p>
    {/if}

    {#if tags.length > 0}
      <ul class="food-tags" aria-label="Tags">
        {#each tags as tag}
          <li class="food-tag">{tag}</li>
        {/each}
      </ul>
    {/if}
  </figcaption>
</figure>

<style>
  .food-card {
    display: flex;
    flex-direction: row;
    margin: 0;
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
    background: var(--entry);
    font-family: var(--font-sans);
    width: 100%;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .food-card:hover {
    border-color: var(--tertiary);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  }

  .food-img-wrap {
    width: 35%;
    flex-shrink: 0;
    overflow: hidden;
    background: var(--tertiary);
    min-height: 180px;
  }

  .food-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.4s ease;
  }

  .food-card:hover .food-img-wrap img {
    transform: scale(1.04);
  }

  .food-body {
    padding: 1.25em 1.5em;
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.4em;
  }

  .food-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 0.75em;
  }

  .food-name {
    margin: 0;
    font-size: 1.05em;
    font-weight: 700;
    color: var(--primary);
    line-height: 1.3;
    letter-spacing: -0.01em;
  }

  .food-price {
    font-size: 0.95em;
    font-weight: 700;
    color: var(--accent);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .food-meta {
    margin: 0;
    padding: 0;
    font-size: 0.82em;
    color: var(--secondary);
    display: flex;
    flex-wrap: wrap;
    gap: 0.3em;
    align-items: center;
  }

  .sep { color: var(--border); }

  .food-notes {
    margin: 0;
    font-size: 0.875em;
    color: var(--content);
    line-height: 1.6;
    font-style: italic;
  }

  .food-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3em;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .food-tag {
    font-size: 0.72em;
    padding: 0.15em 0.55em;
    border-radius: 999px;
    background: color-mix(in srgb, var(--accent) 10%, var(--entry));
    color: var(--accent);
    font-weight: 500;
    letter-spacing: 0.02em;
  }

  @media (max-width: 520px) {
    .food-card {
      flex-direction: column;
    }

    .food-img-wrap {
      width: 100%;
      min-height: 160px;
      max-height: 200px;
    }
  }
</style>

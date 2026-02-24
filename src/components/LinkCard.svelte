<script lang="ts">
  interface Props {
    url: string;
    title: string;
    description?: string;
    image?: string;
    siteName?: string;
    favicon?: string;
  }

  let { url, title, description, image, siteName, favicon }: Props = $props();

  // Derive a clean display hostname
  const host = (() => {
    try { return new URL(url).hostname.replace(/^www\./, ''); }
    catch { return url; }
  })();

  const displaySite = siteName ?? host;
</script>

<a href={url} target="_blank" rel="noopener noreferrer" class="link-card" class:has-image={!!image}>
  {#if image}
    <div class="link-card-img-wrap">
      <img src={image} alt={title} loading="lazy" />
    </div>
  {/if}

  <div class="link-card-body">
    <div class="link-card-site">
      {#if favicon}
        <img src={favicon} alt="" class="link-card-favicon" aria-hidden="true" />
      {/if}
      <span>{displaySite}</span>
    </div>
    <p class="link-card-title">{title}</p>
    {#if description}
      <p class="link-card-desc">{description}</p>
    {/if}
  </div>

  <span class="link-card-arrow" aria-hidden="true">↗</span>
</a>

<style>
  .link-card {
    display: flex;
    align-items: stretch;
    gap: 0;
    margin: 1.75em 0;
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
    background: var(--entry);
    text-decoration: none;
    font-family: var(--font-sans);
    transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
    position: relative;
  }

  .link-card:hover {
    border-color: var(--link);
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    transform: translateY(-1px);
  }

  .link-card-img-wrap {
    width: 180px;
    flex-shrink: 0;
    overflow: hidden;
    background: var(--tertiary);
  }

  .link-card-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.35s ease;
  }

  .link-card:hover .link-card-img-wrap img {
    transform: scale(1.04);
  }

  .link-card-body {
    padding: 1em 2.5em 1em 1.25em;
    display: flex;
    flex-direction: column;
    gap: 0.3em;
    justify-content: center;
    flex: 1;
    min-width: 0;
  }

  .link-card-site {
    display: flex;
    align-items: center;
    gap: 0.4em;
    font-size: 0.72em;
    font-weight: 600;
    color: var(--secondary);
    text-transform: uppercase;
    letter-spacing: 0.07em;
  }

  .link-card-favicon {
    width: 14px;
    height: 14px;
    border-radius: 2px;
    object-fit: contain;
  }

  .link-card-title {
    margin: 0;
    font-size: 0.95em;
    font-weight: 700;
    color: var(--primary);
    line-height: 1.35;
    letter-spacing: -0.01em;
  }

  .link-card:hover .link-card-title {
    color: var(--link);
  }

  .link-card-desc {
    margin: 0;
    font-size: 0.82em;
    color: var(--secondary);
    line-height: 1.5;
    /* Clamp to 2 lines */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .link-card-arrow {
    position: absolute;
    top: 0.85em;
    right: 0.85em;
    font-size: 0.9em;
    color: var(--secondary);
    transition: color 0.15s, transform 0.15s;
  }

  .link-card:hover .link-card-arrow {
    color: var(--link);
    transform: translate(2px, -2px);
  }

  @media (max-width: 520px) {
    .link-card.has-image {
      flex-direction: column;
    }

    .link-card-img-wrap {
      width: 100%;
      height: 140px;
    }
  }
</style>

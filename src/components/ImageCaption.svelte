<script lang="ts">
  interface Props {
    src: string;
    alt: string;
    caption?: string;
    credit?: string;
    creditUrl?: string;
    wide?: boolean;
    aspect?: string; // e.g. '16/9', '4/3', '1/1'
  }

  let {
    src,
    alt,
    caption,
    credit,
    creditUrl,
    wide = false,
    aspect = '16/9',
  }: Props = $props();
</script>

<figure class="img-caption" class:wide>
  <div class="img-wrap" style="aspect-ratio: {aspect}">
    <img {src} {alt} loading="lazy" />
  </div>
  {#if caption || credit}
    <figcaption class="img-caption-text">
      {#if caption}<span class="caption-body">{caption}</span>{/if}
      {#if credit}
        <span class="caption-credit">
          {#if creditUrl}
            <a href={creditUrl} target="_blank" rel="noopener noreferrer">{credit}</a>
          {:else}
            {credit}
          {/if}
        </span>
      {/if}
    </figcaption>
  {/if}
</figure>

<style>
  .img-caption {
    margin: 2em 0;
    padding: 0;
  }

  /* Wide variant: bleeds slightly past the prose column */
  .img-caption.wide {
    margin-left: -1.5em;
    margin-right: -1.5em;
  }

  .img-wrap {
    width: 100%;
    overflow: hidden;
    border-radius: 8px;
    background: var(--tertiary);
  }

  .wide .img-wrap {
    border-radius: 0;
  }

  .img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.4s ease;
  }

  .img-caption:hover .img-wrap img {
    transform: scale(1.02);
  }

  .img-caption-text {
    margin-top: 0.55em;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1em;
    font-size: 0.82em;
    line-height: 1.45;
  }

  .caption-body {
    color: var(--secondary);
    font-style: italic;
    flex: 1;
  }

  .caption-credit {
    color: var(--secondary);
    opacity: 0.6;
    white-space: nowrap;
    font-size: 0.92em;
  }

  .caption-credit a {
    color: inherit;
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .caption-credit a:hover {
    opacity: 1;
    color: var(--secondary);
  }
</style>

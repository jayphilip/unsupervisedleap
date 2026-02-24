<script lang="ts">
  interface Props {
    quote: string;
    attribution?: string;
    align?: 'left' | 'center';
    size?: 'normal' | 'large';
  }

  let {
    quote,
    attribution,
    align = 'left',
    size = 'normal',
  }: Props = $props();
</script>

<blockquote class="pull-quote align-{align} size-{size}">
  <span class="pull-quote-mark" aria-hidden="true">"</span>
  <p class="pull-quote-text">{quote}</p>
  {#if attribution}
    <footer class="pull-quote-attribution">— {attribution}</footer>
  {/if}
</blockquote>

<style>
  .pull-quote {
    margin: 2.5em 0;
    padding: 0;
    border: none;
    position: relative;
  }

  .pull-quote.align-left {
    padding-left: 1.5em;
    border-left: 3px solid var(--accent);
  }

  .pull-quote.align-center {
    text-align: center;
    padding: 0 1em;
  }

  .pull-quote-mark {
    display: block;
    font-family: var(--font-serif);
    font-size: 5em;
    line-height: 0.6;
    color: var(--accent);
    opacity: 0.35;
    margin-bottom: 0.15em;
    user-select: none;
  }

  /* Centered: pull the mark out of flow so it doesn't push text down */
  .align-center .pull-quote-mark {
    position: absolute;
    top: -0.25em;
    left: 50%;
    transform: translateX(-50%);
    margin: 0;
    line-height: 1;
  }

  .align-center {
    position: relative;
    padding-top: 1.25em;
  }

  .pull-quote-text {
    margin: 0;
    font-family: var(--font-serif);
    font-style: italic;
    color: var(--primary);
    line-height: 1.55;
    font-size: 1.25em;
    letter-spacing: -0.01em;
  }

  .size-large .pull-quote-text {
    font-size: 1.6em;
  }

  .pull-quote-attribution {
    margin-top: 0.75em;
    font-size: 0.82em;
    color: var(--secondary);
    font-family: var(--font-sans);
    font-style: normal;
    font-weight: 500;
    letter-spacing: 0.02em;
  }
</style>

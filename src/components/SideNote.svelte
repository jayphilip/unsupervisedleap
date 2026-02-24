<script lang="ts">
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();

  let visible = $state(false);
  let id = $state(`sn-${Math.random().toString(36).slice(2, 7)}`);
</script>

<!--
  Usage in MDX:
    Some sentence<SideNote>This appears in the margin on wide screens.</SideNote> continues here.
-->

<!-- Inline marker (always visible) -->
<button
  class="sidenote-marker"
  onclick={() => (visible = !visible)}
  aria-expanded={visible}
  aria-controls={id}
  aria-label="Toggle sidenote"
>*</button>

<!-- Mobile inline reveal -->
<span
  {id}
  class="sidenote-inline"
  class:open={visible}
  role="note"
>
  {@render children?.()}
</span>

<!-- Wide-screen margin note (always visible in margin) -->
<aside class="sidenote-margin" role="note" aria-hidden="true">
  {@render children?.()}
</aside>

<style>
  .sidenote-marker {
    display: inline;
    background: none;
    border: none;
    padding: 0 0.05em;
    font-size: 0.8em;
    font-weight: 700;
    color: var(--accent);
    cursor: pointer;
    line-height: 1;
    vertical-align: super;
    font-family: var(--font-sans);
    transition: color 0.15s;
  }

  .sidenote-marker:hover {
    color: var(--link);
  }

  /* ── Mobile: inline reveal ── */
  .sidenote-inline {
    display: none;
    font-size: 0.85em;
    color: var(--secondary);
    font-style: italic;
    line-height: 1.5;
    border-left: 2px solid var(--accent);
    padding: 0.4em 0 0.4em 0.85em;
    margin: 0.5em 0;
  }

  .sidenote-inline.open {
    display: block;
  }

  /* ── Wide screens: float into margin ── */
  @media (min-width: 1100px) {
    .sidenote-marker {
      /* Keep marker but no toggle needed */
      pointer-events: none;
    }

    .sidenote-inline {
      display: none !important;
    }

    .sidenote-margin {
      position: absolute;
      right: calc(-1 * (100vw - var(--main-width)) / 2 + 1em);
      width: calc((100vw - var(--main-width)) / 2 - 3em);
      max-width: 220px;
      font-size: 0.78em;
      color: var(--secondary);
      font-style: italic;
      line-height: 1.5;
      border-left: 2px solid color-mix(in srgb, var(--accent) 40%, transparent);
      padding-left: 0.75em;
      top: 0;
      transform: translateY(-0.15em);
    }

    /* The parent prose needs position:relative — handled via :global below */
    :global(.post-content p:has(.sidenote-margin)) {
      position: relative;
    }
  }

  /* Below 1100px: hide the margin note entirely (inline does the job) */
  @media (max-width: 1099px) {
    .sidenote-margin {
      display: none;
    }
  }
</style>

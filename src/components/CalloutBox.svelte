<script lang="ts">
  interface Props {
    type?: 'info' | 'warning' | 'note' | 'danger';
    title?: string;
    collapsible?: boolean;
  }

  let {
    type = 'info',
    title = '',
    collapsible = false,
  }: Props = $props();

  let open = $state(true);

  const icons: Record<string, string> = {
    info: '💡',
    warning: '⚠️',
    note: '📝',
    danger: '🚨',
  };
</script>

<aside class="callout callout-{type}">
  {#if collapsible}
    <button
      class="callout-header clickable"
      type="button"
      aria-expanded={open}
      onclick={() => (open = !open)}
    >
      <span class="callout-icon" aria-hidden="true">{icons[type] ?? '💡'}</span>
      {#if title}<strong class="callout-title">{title}</strong>{/if}
      <span class="callout-chevron" aria-hidden="true">{open ? '▲' : '▼'}</span>
    </button>
  {:else}
    <div class="callout-header">
      <span class="callout-icon" aria-hidden="true">{icons[type] ?? '💡'}</span>
      {#if title}<strong class="callout-title">{title}</strong>{/if}
    </div>
  {/if}
  {#if open}
    <div class="callout-body">
      <slot />
    </div>
  {/if}
</aside>

<style>
  .callout {
    border-radius: 8px;
    margin: 2em 0;
    overflow: hidden;
    border: 1px solid var(--border);
    font-family: var(--font-sans);
    font-size: 0.95em;
  }

  .callout-info    { border-left: 4px solid var(--link);    background: color-mix(in srgb, var(--link)    8%, var(--entry)); }
  .callout-warning { border-left: 4px solid #f59e0b;         background: color-mix(in srgb, #f59e0b        8%, var(--entry)); }
  .callout-note    { border-left: 4px solid var(--secondary); background: var(--entry); }
  .callout-danger  { border-left: 4px solid #ef4444;          background: color-mix(in srgb, #ef4444       8%, var(--entry)); }

  .callout-header {
    display: flex;
    align-items: center;
    gap: 0.5em;
    padding: 0.85em 1.25em;
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    font: inherit;
    cursor: default;
  }

  .callout-header.clickable {
    cursor: pointer;
    user-select: none;
  }

  .callout-icon  { font-size: 1em; line-height: 1; }
  .callout-title { font-weight: 600; color: var(--primary); }
  .callout-chevron { margin-left: auto; font-size: 0.7em; color: var(--secondary); }

  .callout-body {
    padding: 0 1.25em 1.25em;
    color: var(--content);
    line-height: 1.6;
  }

  .callout-body :global(p:last-child) { margin-bottom: 0; }
  .callout-body :global(p)            { margin-bottom: 0.75em; }
</style>

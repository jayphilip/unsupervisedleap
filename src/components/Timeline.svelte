<script lang="ts">
  interface TimelineEvent {
    date: string;
    title: string;
    body?: string;
    tag?: string;
    tagColor?: string;
  }

  interface Props {
    events: TimelineEvent[];
    direction?: 'vertical' | 'horizontal';
  }

  let { events, direction = 'vertical' }: Props = $props();
</script>

<div class="timeline direction-{direction}" role="list">
  {#each events as event, i}
    <div class="timeline-event" role="listitem">
      {#if direction === 'vertical'}
        <!-- Dot + line on the left -->
        <div class="timeline-rail" aria-hidden="true">
          <span class="timeline-dot"></span>
          {#if i < events.length - 1}
            <span class="timeline-line"></span>
          {/if}
        </div>
      {/if}

      <div class="timeline-content">
        <div class="timeline-header">
          <time class="timeline-date">{event.date}</time>
          {#if event.tag}
            <span
              class="timeline-tag"
              style={event.tagColor ? `background: color-mix(in srgb, ${event.tagColor} 12%, var(--entry)); color: ${event.tagColor};` : ''}
            >{event.tag}</span>
          {/if}
        </div>
        <h3 class="timeline-title">{event.title}</h3>
        {#if event.body}
          <p class="timeline-body">{event.body}</p>
        {/if}
      </div>
    </div>
  {/each}
</div>

<style>
  .timeline {
    margin: 2.5em 0;
    font-family: var(--font-sans);
  }

  /* ── Vertical (default) ── */
  .direction-vertical {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .direction-vertical .timeline-event {
    display: grid;
    grid-template-columns: 28px 1fr;
    gap: 0 1.1em;
    padding-bottom: 2em;
  }

  .direction-vertical .timeline-event:last-child {
    padding-bottom: 0;
  }

  .timeline-rail {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 0.2em;
  }

  .timeline-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--accent);
    flex-shrink: 0;
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 18%, var(--theme));
    transition: transform 0.2s ease;
  }

  .timeline-event:hover .timeline-dot {
    transform: scale(1.3);
  }

  .timeline-line {
    flex: 1;
    width: 1px;
    background: var(--border);
    margin-top: 6px;
  }

  /* ── Horizontal ── */
  .direction-horizontal {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    gap: 0;
    overflow-x: auto;
    padding-bottom: 0.5em;
  }

  .direction-horizontal .timeline-event {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0 1.5em 0 0;
    position: relative;
    min-width: 160px;
  }

  .direction-horizontal .timeline-event::before {
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--accent);
    margin-bottom: 0.65em;
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 18%, var(--theme));
    flex-shrink: 0;
  }

  .direction-horizontal .timeline-event::after {
    content: '';
    position: absolute;
    top: 4px;
    left: 10px;
    right: 0;
    height: 1px;
    background: var(--border);
  }

  .direction-horizontal .timeline-event:last-child::after {
    display: none;
  }

  /* ── Content ── */
  .timeline-content {
    min-width: 0;
  }

  .timeline-header {
    display: flex;
    align-items: center;
    gap: 0.5em;
    flex-wrap: wrap;
    margin-bottom: 0.2em;
  }

  .timeline-date {
    font-size: 0.75em;
    font-weight: 600;
    color: var(--secondary);
    letter-spacing: 0.04em;
  }

  .timeline-tag {
    font-size: 0.68em;
    padding: 0.12em 0.5em;
    border-radius: 999px;
    background: color-mix(in srgb, var(--accent) 12%, var(--entry));
    color: var(--accent);
    font-weight: 600;
    letter-spacing: 0.03em;
  }

  .timeline-title {
    margin: 0 0 0.3em;
    font-size: 0.95em;
    font-weight: 700;
    color: var(--primary);
    line-height: 1.35;
    letter-spacing: -0.01em;
  }

  .timeline-body {
    margin: 0;
    font-size: 0.85em;
    color: var(--secondary);
    line-height: 1.55;
  }
</style>

<script lang="ts">
  interface Premise {
    text: string;
    premises?: Premise[];   // supporting sub-premises
    objection?: string;     // counterpoint shown inline
    flagged?: boolean;      // mark a contested/weak premise
  }

  interface Props {
    conclusion: string;
    premises: Premise[];
    title?: string;
    valid?: boolean;        // show a "valid" / "contested" badge
  }

  let { conclusion, premises, title, valid }: Props = $props();
</script>

<figure class="arg-map">
  {#if title}
    <p class="am-title">{title}</p>
  {/if}

  <div class="am-body">
    <!-- Premises tree -->
    <div class="am-premises">
      {#snippet premiseTree(nodes: Premise[], depth: number)}
        {#each nodes as node, i}
          <div class="am-premise-wrap" style="--depth: {depth}">
            <div class="am-premise" class:am-flagged={node.flagged}>
              <span class="am-bullet" aria-hidden="true">P{depth === 0 ? i + 1 : '·'}</span>
              <span class="am-text">{node.text}</span>
            </div>
            {#if node.objection}
              <div class="am-objection">
                <span class="am-obj-label">⚑ Objection</span>
                <span class="am-obj-text">{node.objection}</span>
              </div>
            {/if}
            {#if node.premises && node.premises.length > 0}
              {@render premiseTree(node.premises, depth + 1)}
            {/if}
          </div>
        {/each}
      {/snippet}
      {@render premiseTree(premises, 0)}
    </div>

    <!-- Therefore line -->
    <div class="am-therefore-row" aria-hidden="true">
      <div class="am-therefore-line"></div>
      <span class="am-therefore">∴ therefore</span>
    </div>

    <!-- Conclusion -->
    <div class="am-conclusion">
      <span class="am-c-label">C</span>
      <span class="am-c-text">{conclusion}</span>
      {#if valid !== undefined}
        <span class="am-badge" class:valid class:contested={!valid}>
          {valid ? 'Valid' : 'Contested'}
        </span>
      {/if}
    </div>
  </div>
</figure>

<style>
  .arg-map {
    margin: 1.75em 0;
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
    background: var(--entry);
    font-family: var(--font-sans);
  }

  .am-title {
    margin: 0;
    padding: 0.7em 1.2em;
    font-size: 0.75em;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--secondary);
    background: color-mix(in srgb, var(--accent) 6%, var(--entry));
    border-bottom: 1px solid var(--border);
  }

  .am-body {
    padding: 1.1em 1.2em;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .am-premises {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    padding-bottom: 0.75em;
  }

  .am-premise-wrap {
    padding-left: calc(var(--depth, 0) * 1.4em);
    display: flex;
    flex-direction: column;
    gap: 0.3em;
  }

  .am-premise {
    display: flex;
    align-items: baseline;
    gap: 0.6em;
  }

  .am-flagged .am-text {
    color: #f59e0b;
  }

  .am-bullet {
    font-size: 0.68em;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
    color: var(--accent);
    flex-shrink: 0;
    min-width: 1.6em;
    text-align: right;
    opacity: 0.8;
  }

  .am-text {
    font-size: 0.88em;
    color: var(--primary);
    line-height: 1.55;
  }

  .am-objection {
    margin-left: calc(0.6em + 1.6em);
    display: flex;
    gap: 0.45em;
    align-items: baseline;
    padding: 0.35em 0.7em;
    border-radius: 5px;
    background: color-mix(in srgb, #f87171 10%, var(--entry));
    border-left: 2px solid #f87171;
  }

  .am-obj-label {
    font-size: 0.65em;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: #f87171;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .am-obj-text {
    font-size: 0.78em;
    color: var(--content);
    font-style: italic;
    line-height: 1.5;
  }

  /* Therefore divider */
  .am-therefore-row {
    display: flex;
    align-items: center;
    gap: 0.75em;
    padding: 0.4em 0;
    margin-bottom: 0.55em;
  }

  .am-therefore-line {
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  .am-therefore {
    font-size: 0.7em;
    font-style: italic;
    color: var(--secondary);
    white-space: nowrap;
    font-family: var(--font-serif);
    letter-spacing: 0.03em;
  }

  /* Conclusion */
  .am-conclusion {
    display: flex;
    align-items: baseline;
    gap: 0.65em;
    padding: 0.6em 0.85em;
    background: color-mix(in srgb, var(--accent) 8%, var(--entry));
    border-radius: 7px;
    border: 1px solid color-mix(in srgb, var(--accent) 20%, var(--border));
  }

  .am-c-label {
    font-size: 0.68em;
    font-weight: 900;
    color: var(--accent);
    flex-shrink: 0;
    min-width: 1.2em;
    text-align: right;
    opacity: 0.9;
  }

  .am-c-text {
    font-size: 0.92em;
    font-weight: 700;
    font-family: var(--font-serif);
    color: var(--primary);
    line-height: 1.4;
    flex: 1;
  }

  .am-badge {
    font-size: 0.65em;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    padding: 0.2em 0.6em;
    border-radius: 999px;
    flex-shrink: 0;
  }

  .am-badge.valid {
    background: color-mix(in srgb, #22c55e 15%, var(--entry));
    color: #22c55e;
  }

  .am-badge.contested {
    background: color-mix(in srgb, #f87171 15%, var(--entry));
    color: #f87171;
  }
</style>

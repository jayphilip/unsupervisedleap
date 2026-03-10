<script lang="ts">
  interface Props {
    title: string;
    description?: string;
    prepTime?: string;
    cookTime?: string;
    totalTime?: string;
    servings?: number | string;
    difficulty?: 'easy' | 'medium' | 'hard';
    ingredients: string[];
    steps: string[];
    tags?: string[];
    collapsed?: boolean;
  }

  let {
    title,
    description,
    prepTime,
    cookTime,
    totalTime,
    servings,
    difficulty,
    ingredients,
    steps,
    tags = [],
    collapsed: initialCollapsed = true,
  }: Props = $props();

  const difficultyColor: Record<string, string> = {
    easy: '#22c55e',
    medium: '#f59e0b',
    hard: '#ef4444',
  };

  let collapsed = $state(initialCollapsed);

  function toggleCollapsed() {
    collapsed = !collapsed;
  }

  // Track which steps have been checked off
  let done = $state<boolean[]>(steps.map(() => false));

  function toggleStep(i: number) {
    done[i] = !done[i];
  }

  // Stable id for targeting the card in print
  const cardId = `recipe-${title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;

  function printCard() {
    const el = document.getElementById(cardId);
    if (!el) return;
    const printContent = el.outerHTML;
    const win = window.open('', '_blank', 'width=800,height=900');
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title} — Recipe</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: -apple-system, sans-serif; font-size: 14px; color: #1a1a1a; background: #fff; padding: 2em; }
            .recipe-card { border: 1px solid #ddd; border-radius: 10px; overflow: hidden; }
            .recipe-header { padding: 1.25em 1.5em 1em; border-bottom: 1px solid #ddd; }
            .recipe-title { font-size: 1.4em; font-weight: 700; margin-bottom: 0.3em; }
            .recipe-desc { font-size: 0.9em; color: #555; margin-bottom: 0.9em; }
            .recipe-stats { display: flex; flex-wrap: wrap; border: 1px solid #ddd; border-radius: 6px; overflow: hidden; }
            .stat { flex: 1; min-width: 70px; display: flex; flex-direction: column; align-items: center; padding: 0.6em 0.4em; border-right: 1px solid #ddd; text-align: center; }
            .stat:last-child { border-right: none; }
            .stat-label { font-size: 0.65em; text-transform: uppercase; letter-spacing: 0.07em; color: #888; font-weight: 600; margin-bottom: 0.2em; }
            .stat-value { font-size: 0.85em; font-weight: 600; }
            .recipe-body { display: grid; grid-template-columns: 1fr 2fr; }
            .recipe-ingredients { padding: 1.25em 1.5em; border-right: 1px solid #ddd; }
            .recipe-steps { padding: 1.25em 1.5em; }
            .recipe-ingredients h3, .recipe-steps h3 { font-size: 0.68em; text-transform: uppercase; letter-spacing: 0.09em; color: #888; font-weight: 700; margin-bottom: 0.75em; }
            .recipe-ingredients ul { padding-left: 1em; display: grid; gap: 0.4em; }
            .recipe-ingredients ul li { font-size: 0.87em; line-height: 1.4; }
            .recipe-steps ol { list-style: decimal; padding-left: 1.25em; display: grid; gap: 0.6em; }
            .recipe-steps ol li { font-size: 0.87em; line-height: 1.5; }
            .step-btn { background: none; border: none; font: inherit; color: inherit; text-align: left; padding: 0; cursor: default; }
            .step-btn::before { display: none; }
            .recipe-footer { display: flex; flex-wrap: wrap; gap: 0.4em; padding: 0.75em 1.5em; border-top: 1px solid #ddd; }
            .recipe-tag { font-size: 0.72em; padding: 0.15em 0.55em; border-radius: 999px; background: #f0eaff; color: #6b21a8; font-weight: 500; }
            .step-hint, .recipe-pdf-btn { display: none; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
  }
</script>

<section class="recipe-card" id={cardId} class:is-collapsed={collapsed}>
  <header class="recipe-header">
    <div class="recipe-title-row">
      <button
        class="recipe-toggle"
        onclick={toggleCollapsed}
        aria-expanded={!collapsed}
        aria-controls="{cardId}-body"
      >
        <h2 class="recipe-title">{title}</h2>
        <svg class="toggle-chevron" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      {#if !collapsed}
        <button class="recipe-pdf-btn" onclick={printCard} title="Save as PDF" aria-label="Save recipe as PDF">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Save PDF
        </button>
      {/if}
    </div>
    {#if description && !collapsed}
      <p class="recipe-desc">{description}</p>
    {/if}
    {#if description && collapsed}
      <p class="recipe-desc-preview">{description}</p>
    {/if}
  </header>

  {#if !collapsed}
    <div id="{cardId}-body">
      <div class="recipe-stats-row">
        {#if prepTime}<span class="stat-chip"><span class="stat-chip-label">Prep</span> {prepTime}</span>{/if}
        {#if cookTime}<span class="stat-chip"><span class="stat-chip-label">Cook</span> {cookTime}</span>{/if}
        {#if totalTime}<span class="stat-chip"><span class="stat-chip-label">Total</span> {totalTime}</span>{/if}
        {#if servings}<span class="stat-chip"><span class="stat-chip-label">Serves</span> {servings}</span>{/if}
        {#if difficulty}<span class="stat-chip"><span class="stat-chip-label">Level</span> <span style="color: {difficultyColor[difficulty]}; text-transform: capitalize;">{difficulty}</span></span>{/if}
      </div>

      <div class="recipe-body">
        <div class="recipe-ingredients">
          <h3>Ingredients</h3>
          <ul>
            {#each ingredients as item}
              <li>{item}</li>
            {/each}
          </ul>
        </div>

        <div class="recipe-steps">
          <h3>Instructions</h3>
          <ol>
            {#each steps as step, i}
              <li class:done={done[i]}>
                <button
                  class="step-btn"
                  onclick={() => toggleStep(i)}
                  aria-pressed={done[i]}
                  title={done[i] ? 'Mark undone' : 'Mark done'}
                >
                  <span class="step-text">{step}</span>
                </button>
              </li>
            {/each}
          </ol>
          <p class="step-hint">Tap a step to mark it done.</p>
        </div>
      </div>

      {#if tags.length > 0}
        <footer class="recipe-footer">
          {#each tags as tag}
            <span class="recipe-tag">{tag}</span>
          {/each}
        </footer>
      {/if}
    </div>
  {/if}
</section>

<style>
  .recipe-card {
    margin: 0.35em 0;
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
    background: var(--entry);
    font-family: var(--font-sans);
    transition: border-color 0.15s;
  }

  .recipe-card:hover {
    border-color: color-mix(in srgb, var(--border) 60%, var(--secondary));
  }

  .recipe-header {
    padding: 0.8em 1.1em;
  }

  .recipe-title-row {
    display: flex;
    align-items: flex-start;
    gap: 0.75em;
  }

  .recipe-toggle {
    display: flex;
    align-items: flex-start;
    gap: 0.5em;
    flex: 1;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    text-align: left;
    font: inherit;
    color: inherit;
    min-width: 0;
  }

  .recipe-toggle:hover .recipe-title {
    color: var(--accent);
  }

  .toggle-chevron {
    flex-shrink: 0;
    color: var(--secondary);
    transition: transform 0.2s;
    margin-top: 0.15em;
  }

  :global(.recipe-card:not(.is-collapsed)) .toggle-chevron {
    transform: rotate(180deg);
  }

  .recipe-title {
    margin: 0;
    font-size: 1em;
    font-weight: 600;
    color: var(--primary);
    letter-spacing: -0.01em;
    transition: color 0.15s;
    line-height: 1.35;
  }

  .recipe-pdf-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.35em;
    padding: 0.3em 0.7em;
    font-size: 0.72em;
    font-weight: 600;
    font-family: var(--font-sans);
    color: var(--secondary);
    background: none;
    border: 1px solid var(--border);
    border-radius: 5px;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
    transition: color 0.15s, border-color 0.15s;
  }

  .recipe-pdf-btn:hover {
    color: var(--primary);
    border-color: var(--secondary);
  }

  .recipe-desc {
    margin: 0.45em 0 0.1em;
    font-size: 0.85em;
    color: var(--secondary);
    line-height: 1.5;
  }

  .recipe-desc-preview {
    margin: 0.25em 0 0;
    font-size: 0.82em;
    color: var(--secondary);
    line-height: 1.45;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .recipe-stats-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4em 0.75em;
    padding: 0.6em 1.1em;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }

  .stat-chip {
    font-size: 0.78em;
    color: var(--secondary);
  }

  .stat-chip-label {
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: 0.85em;
    color: var(--tertiary);
    margin-right: 0.2em;
  }

  .recipe-body {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }

  @media (max-width: 600px) {
    .recipe-body {
      grid-template-columns: 1fr;
    }
  }

  .recipe-ingredients,
  .recipe-steps {
    padding: 1em 1.25em;
  }

  .recipe-ingredients {
    border-right: 1px solid var(--border);
  }

  @media (max-width: 600px) {
    .recipe-ingredients {
      border-right: none;
      border-bottom: 1px solid var(--border);
    }
  }

  .recipe-ingredients h3,
  .recipe-steps h3 {
    margin: 0 0 0.85em;
    font-size: 0.72em;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    color: var(--secondary);
    font-weight: 700;
  }

  .recipe-ingredients ul {
    margin: 0;
    padding: 0 0 0 1.1em;
    display: grid;
    gap: 0.45em;
  }

  .recipe-ingredients ul li {
    font-size: 0.9em;
    color: var(--content);
    line-height: 1.45;
  }

  .recipe-steps ol {
    margin: 0;
    padding: 0;
    list-style: none;
    counter-reset: steps;
    display: grid;
    gap: 0.4em;
  }

  .recipe-steps ol li {
    counter-increment: steps;
    transition: opacity 0.2s;
  }

  .recipe-steps ol li.done {
    opacity: 0.4;
  }

  .step-btn {
    display: flex;
    align-items: flex-start;
    gap: 0.75em;
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    padding: 0.55em 0.6em;
    border-radius: 6px;
    cursor: pointer;
    font: inherit;
    color: var(--content);
    transition: background 0.15s;
  }

  .step-btn:hover {
    background: color-mix(in srgb, var(--accent) 8%, transparent);
  }

  /* Step number bubble via CSS counter */
  .step-btn::before {
    content: counter(steps);
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 1.55em;
    height: 1.55em;
    border-radius: 50%;
    background: color-mix(in srgb, var(--accent) 15%, var(--entry));
    color: var(--accent);
    font-size: 0.73em;
    font-weight: 700;
    flex-shrink: 0;
    margin-top: 0.05em;
    transition: background 0.2s, color 0.2s;
  }

  .recipe-steps ol li.done .step-btn::before {
    content: '✓';
    background: color-mix(in srgb, #22c55e 15%, var(--entry));
    color: #22c55e;
  }

  .step-text {
    font-size: 0.9em;
    line-height: 1.5;
  }

  .step-hint {
    margin: 0.65em 0 0;
    font-size: 0.76em;
    color: var(--secondary);
    font-style: italic;
  }

  .recipe-footer {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4em;
    padding: 0.65em 1.25em;
    border-top: 1px solid var(--border);
  }

  .recipe-tag {
    font-size: 0.75em;
    padding: 0.2em 0.65em;
    border-radius: 999px;
    background: color-mix(in srgb, var(--accent) 10%, var(--entry));
    color: var(--accent);
    font-weight: 500;
  }
</style>

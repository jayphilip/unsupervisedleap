<script lang="ts">
  interface Props {
    title: string;
    description?: string;
    prepTime?: string;
    cookTime?: string;
    totalTime?: string;
    servings?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
    ingredients: string[];
    steps: string[];
    tags?: string[];
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
  }: Props = $props();

  const difficultyColor: Record<string, string> = {
    easy: '#22c55e',
    medium: '#f59e0b',
    hard: '#ef4444',
  };

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

<section class="recipe-card" id={cardId}>
  <header class="recipe-header">
    <div class="recipe-title-row">
      <h2 class="recipe-title">{title}</h2>
      <button class="recipe-pdf-btn" onclick={printCard} title="Save as PDF" aria-label="Save recipe as PDF">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Save PDF
      </button>
    </div>
    {#if description}
      <p class="recipe-desc">{description}</p>
    {/if}

    <div class="recipe-stats">
      {#if prepTime}
        <div class="stat">
          <span class="stat-label">Prep</span>
          <span class="stat-value">{prepTime}</span>
        </div>
      {/if}
      {#if cookTime}
        <div class="stat">
          <span class="stat-label">Cook</span>
          <span class="stat-value">{cookTime}</span>
        </div>
      {/if}
      {#if totalTime}
        <div class="stat">
          <span class="stat-label">Total</span>
          <span class="stat-value">{totalTime}</span>
        </div>
      {/if}
      {#if servings}
        <div class="stat">
          <span class="stat-label">Serves</span>
          <span class="stat-value">{servings}</span>
        </div>
      {/if}
      {#if difficulty}
        <div class="stat">
          <span class="stat-label">Level</span>
          <span
            class="stat-value"
            style="color: {difficultyColor[difficulty]}; font-weight: 600; text-transform: capitalize;"
          >{difficulty}</span>
        </div>
      {/if}
    </div>
  </header>

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
</section>

<style>
  .recipe-card {
    margin: 2.5em 0;
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    background: var(--entry);
    font-family: var(--font-sans);
  }

  .recipe-header {
    padding: 1.5em 1.75em 1.25em;
    border-bottom: 1px solid var(--border);
  }

  .recipe-title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1em;
    margin-bottom: 0.3em;
  }

  .recipe-title {
    margin: 0;
    font-size: 1.3em;
    font-weight: 700;
    color: var(--primary);
    letter-spacing: -0.02em;
  }

  .recipe-pdf-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.35em;
    padding: 0.35em 0.8em;
    font-size: 0.75em;
    font-weight: 600;
    font-family: var(--font-sans);
    color: var(--secondary);
    background: none;
    border: 1px solid var(--border);
    border-radius: 6px;
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
    margin: 0 0 1.1em;
    font-size: 0.92em;
    color: var(--secondary);
    line-height: 1.5;
  }

  .recipe-stats {
    display: flex;
    flex-wrap: wrap;
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
  }

  .stat {
    flex: 1;
    min-width: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.7em 0.5em;
    border-right: 1px solid var(--border);
    text-align: center;
  }

  .stat:last-child {
    border-right: none;
  }

  .stat-label {
    font-size: 0.72em;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--secondary);
    font-weight: 600;
    margin-bottom: 0.2em;
  }

  .stat-value {
    font-size: 0.9em;
    font-weight: 600;
    color: var(--primary);
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
    padding: 1.5em 1.75em;
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
    padding: 0.9em 1.75em;
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

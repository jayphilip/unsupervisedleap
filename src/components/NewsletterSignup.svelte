<script lang="ts">
  type Status = 'idle' | 'loading' | 'success' | 'error';

  const FORM_ID = '718c6e097b';
  const ENDPOINT = `https://app.kit.com/forms/${FORM_ID}/subscriptions`;

  // card=true → standalone card with headline (homepage)
  // card=false (default) → compact embedded version (post footer)
  let { card = false } = $props<{ card?: boolean }>();

  let email = $state('');
  let status = $state<Status>('idle');
  let errorMsg = $state('');

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    if (!email || status === 'loading') return;

    status = 'loading';
    errorMsg = '';

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email_address: email }),
      });

      if (res.ok) {
        status = 'success';
        email = '';
      } else {
        const data = await res.json().catch(() => ({}));
        errorMsg = data?.message ?? 'Something went wrong. Please try again.';
        status = 'error';
      }
    } catch {
      errorMsg = 'Could not connect. Please try again.';
      status = 'error';
    }
  }
</script>

{#if card}
  <div class="newsletter-card">
    {#if status === 'success'}
      <div class="newsletter-success">
        <span class="success-icon" aria-hidden="true">✓</span>
        <div>
          <strong>You're in.</strong>
          <p>Check your inbox to confirm — then you'll get new posts as they drop.</p>
        </div>
      </div>
    {:else}
      <p class="card-eyebrow">Stay in the loop</p>
      <h2 class="card-headline">Get new posts by email</h2>
      <p class="card-sub">No noise. Just new essays when they drop — on AI, fatherhood, and the questions worth asking.</p>
      <form class="newsletter-form" onsubmit={submit} novalidate>
        <input
          type="email"
          bind:value={email}
          placeholder="your@email.com"
          aria-label="Email address"
          required
          disabled={status === 'loading'}
          class="newsletter-input"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          class="newsletter-btn"
        >
          {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
        </button>
      </form>
      {#if status === 'error'}
        <p class="newsletter-error" role="alert">{errorMsg}</p>
      {/if}
      <p class="newsletter-fine">No spam. Unsubscribe any time.</p>
    {/if}
  </div>
{:else}
  <div class="newsletter">
    {#if status === 'success'}
      <div class="newsletter-success">
        <span class="success-icon" aria-hidden="true">✓</span>
        <div>
          <strong>You're in.</strong>
          <p>Check your inbox to confirm — then you'll get new posts as they drop.</p>
        </div>
      </div>
    {:else}
      <p class="newsletter-label">Get new posts by email</p>
      <form class="newsletter-form" onsubmit={submit} novalidate>
        <input
          type="email"
          bind:value={email}
          placeholder="your@email.com"
          aria-label="Email address"
          required
          disabled={status === 'loading'}
          class="newsletter-input"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          class="newsletter-btn"
        >
          {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
        </button>
      </form>
      {#if status === 'error'}
        <p class="newsletter-error" role="alert">{errorMsg}</p>
      {/if}
      <p class="newsletter-fine">No spam. Unsubscribe any time.</p>
    {/if}
  </div>
{/if}

<style>
  /* ── Standalone card (homepage) ── */
  .newsletter-card {
    background: var(--entry);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 2.5em 2.75em;
    text-align: center;
  }

  .card-eyebrow {
    font-family: var(--font-sans);
    font-size: 0.78em;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--accent);
    margin: 0 0 0.6em;
  }

  .card-headline {
    font-family: var(--font-sans);
    font-size: clamp(1.4em, 3vw, 1.9em);
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--primary);
    margin: 0 0 0.6em;
  }

  .card-sub {
    font-family: var(--font-serif);
    font-size: 1em;
    line-height: 1.7;
    color: var(--secondary);
    max-width: 480px;
    margin: 0 auto 1.5em;
  }

  .newsletter-card .newsletter-form {
    justify-content: center;
  }

  /* ── Embedded (post footer) ── */
  .newsletter {
    margin-top: 1.5em;
    padding-top: 1.5em;
    border-top: 1px solid var(--border);
  }

  .newsletter-label {
    font-family: var(--font-sans);
    font-size: 0.78em;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--secondary);
    margin: 0 0 0.75em;
  }

  /* ── Shared ── */
  .newsletter-form {
    display: flex;
    gap: 0.5em;
    flex-wrap: wrap;
  }

  .newsletter-input {
    flex: 1;
    min-width: 200px;
    background: var(--theme);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 0.55em 1em;
    font-family: var(--font-sans);
    font-size: 0.95em;
    color: var(--primary);
    outline: none;
    transition: border-color 0.2s ease;
  }

  .newsletter-input::placeholder {
    color: var(--secondary);
    opacity: 0.6;
  }

  .newsletter-input:focus {
    border-color: var(--accent);
  }

  .newsletter-input:disabled {
    opacity: 0.5;
  }

  .newsletter-btn {
    background: var(--accent);
    color: var(--theme);
    border: none;
    border-radius: 8px;
    padding: 0.55em 1.25em;
    font-family: var(--font-sans);
    font-size: 0.95em;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s ease;
    white-space: nowrap;
  }

  .newsletter-btn:hover:not(:disabled) {
    opacity: 0.85;
  }

  .newsletter-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .newsletter-fine {
    font-family: var(--font-sans);
    font-size: 0.78em;
    color: var(--secondary);
    margin: 0.6em 0 0;
    opacity: 0.7;
  }

  .newsletter-error {
    font-family: var(--font-sans);
    font-size: 0.85em;
    color: #ef4444;
    margin: 0.5em 0 0;
  }

  .newsletter-success {
    display: flex;
    align-items: flex-start;
    gap: 0.85em;
  }

  .newsletter-card .newsletter-success {
    justify-content: center;
    text-align: left;
  }

  .success-icon {
    font-size: 1.1em;
    color: var(--accent);
    font-weight: 700;
    flex-shrink: 0;
    margin-top: 0.1em;
  }

  .newsletter-success strong {
    display: block;
    font-family: var(--font-sans);
    font-size: 0.95em;
    color: var(--primary);
    margin-bottom: 0.2em;
  }

  .newsletter-success p {
    font-family: var(--font-sans);
    font-size: 0.875em;
    color: var(--secondary);
    margin: 0;
    line-height: 1.5;
  }
</style>

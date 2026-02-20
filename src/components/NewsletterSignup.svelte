<script lang="ts">
  type Status = 'idle' | 'loading' | 'success' | 'error';

  const FORM_ID = '718c6e097b';
  const ENDPOINT = `https://app.kit.com/forms/${FORM_ID}/subscriptions`;

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

<style>
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

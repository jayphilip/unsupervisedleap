<script lang="ts">
  interface Props {
    author?: string;
    bio?: string;
  }

  let {
    author = 'Jason Albert',
    bio = 'Writing about fatherhood, artificial intelligence, and the questions worth asking. Pattern recognition, one post at a time.',
  }: Props = $props();
</script>

<div class="author-panel">
  <p class="author-label">Author</p>
  <div class="author-body">
    <img src="/images/profile.jpeg" alt={author} class="author-avatar" />
    <div class="author-info">
      <h3 class="author-name">{author}</h3>
      <p class="author-description">{bio}</p>
      <div class="author-social">
        <a href="https://github.com/jasonalbert" aria-label="GitHub" target="_blank" rel="noopener">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
          </svg>
        </a>
        <a href="https://twitter.com/jasonalbert" aria-label="Twitter / X" target="_blank" rel="noopener">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
        <a href="https://linkedin.com/in/jasonalbert" aria-label="LinkedIn" target="_blank" rel="noopener">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>
      </div>
    </div>
  </div>
</div>

<style>
  .author-panel {
    margin: 1.75em 0 0;
    padding: 1.25em 1.5em;
    background: var(--entry);
    border-radius: 10px;
    border: 1px solid var(--border);
  }

  .author-label {
    font-family: var(--font-sans);
    font-size: 0.72em;
    font-weight: 600;
    color: var(--secondary);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin: 0 0 1em;
  }

  .author-body {
    display: flex;
    align-items: flex-start;
    gap: 1.25em;
  }

  .author-avatar {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    border: 2px solid var(--border);
  }

  .author-info {
    flex: 1;
    min-width: 0;
  }

  .author-name {
    font-family: var(--font-sans);
    font-size: 1.05em;
    font-weight: 700;
    margin: 0 0 0.4em;
    color: var(--primary);
  }

  .author-description {
    color: var(--secondary);
    line-height: 1.6;
    margin: 0 0 0.85em;
    font-family: var(--font-sans);
    font-size: 0.9em;
  }

  .author-social {
    display: flex;
    gap: 0.75em;
  }

  .author-social a {
    color: var(--secondary);
    transition: color 0.15s ease;
    display: flex;
    align-items: center;
  }

  .author-social a:hover {
    color: var(--primary);
  }
</style>

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

<div class="author-bio">
  <div class="author-info">
    <h3 class="author-name">{author}</h3>
    <p class="author-description">{bio}</p>
  </div>
</div>

<style>
  .author-bio {
    margin: 4em 0 3em;
    padding: 2em;
    background: var(--entry);
    border: 1px solid var(--border);
    border-radius: 16px;
  }

  .author-name {
    font-family: var(--font-sans);
    font-size: 1.25em;
    font-weight: 700;
    margin: 0 0 0.75em;
    color: var(--primary);
  }

  .author-description {
    color: var(--secondary);
    line-height: 1.6;
    margin: 0;
    font-family: var(--font-sans);
  }
</style>

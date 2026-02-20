<script lang="ts">
  import { onMount } from 'svelte';

  let progress = $state(0);

  onMount(() => {
    function update() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      progress = scrollable > 0 ? Math.min((window.scrollY / scrollable) * 100, 100) : 0;
    }
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  });
</script>

<div class="reading-progress" style="width: {progress}%"></div>

<style>
  .reading-progress {
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--link), var(--accent));
    z-index: 200;
    transition: width 0.1s ease;
    pointer-events: none;
  }
</style>

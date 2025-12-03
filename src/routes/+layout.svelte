<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header class="py-4 flex justify-center">Recetalias header</header>
<main class="max-w-[650px] mx-[20vw] flex-1">
	{@render children()}
</main>
<footer class="py-4 flex justify-center">Recetalias footer</footer>

<style>
	:global(body) {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
</style>

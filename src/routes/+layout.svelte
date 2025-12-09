<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header class="py-4 flex justify-center font-bold text-4xl">Recetalias</header>
<main class="max-w-[650px] mx-[20vw] flex-1">
	{@render children()}
</main>
<footer class="py-4 flex justify-center flex-col items-center">
	<p>Recetas por Natalia Díaz Zeledón</p>
	<p>Desarrollo por Jose Andrés Mejías</p>
</footer>

<style>
	:global(body) {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
</style>

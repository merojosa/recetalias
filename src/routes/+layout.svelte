<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { resolve } from '$app/paths';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header class="py-4 flex justify-center font-bold text-4xl">
	<a href={resolve('/')}>Recetalias</a>
</header>
<main class="max-w-[650px] mx-[5vw] md:mx-auto flex-1 py-6">
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

<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { resolve } from '$app/paths';
	import Logo from '$lib/assets/logo.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header class="p-4 flex justify-center items-center gap-3 font-bold text-4xl">
	<nav class="w-full flex justify-center p-4 border-4 border-[#66914a]">
		<a href={resolve('/')} class="flex items-center gap-3 *:h-28">
			<Logo />
		</a>
	</nav>
</header>
<main class="min-w-[650px] max-w-[650px] mx-[5vw] md:mx-auto flex-1 py-6">
	{@render children()}
</main>
<footer class="bg-black text-white py-4 flex justify-center flex-col items-center">
	<p>Recetas por Natalia Díaz</p>
	<p>
		Desarrollo por <a class="hover:underline" target="_blank" href="https://merojosa.dev"
			>Jose Andrés Mejías</a
		>
	</p>
</footer>

<style>
	:global(body) {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
</style>

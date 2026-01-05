<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg?url';
	import { resolve } from '$app/paths';
	import Logo from '$lib/assets/logo.svelte';
	import Logo2 from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header class="p-4 md:p-8 flex justify-center items-center gap-3 font-bold text-4xl">
	<nav class="w-full flex justify-center">
		<a href={resolve('/')} class="flex items-center gap-3 *:h-20 sm:*:h-24 md:*:h-28">
			<Logo />
		</a>
	</nav>
</header>
<main class="md:min-w-162.5 md:max-w-162.5 mx-[5vw] md:mx-auto flex-1 py-6">
	{@render children()}
</main>
<footer
	class="bg-primary gap-2 text-white py-4 px-6 md:px-20 flex justify-evenly flex-col sm:flex-row items-center"
>
	<div class="flex justify-center sm:justify-start items-center gap-2 w-full flex-1">
		<img class="h-30" src={Logo2} alt="Logo secundario de Recetalias" />
		<div>
			<p class="text-3xl">Recetalias</p>
			<p class="text-sm md:text-base h-fit">
				© {new Date().getFullYear()}. Todos los derechos reservados.
			</p>
		</div>
	</div>

	<div class="flex justify-center flex-col pl-4 sm:pl-0 sm:text-center flex-1 text-sm md:text-base">
		<p>Recetas por Natalia Díaz</p>
		<p>
			Desarrollo por <a class="hover:underline" target="_blank" href="https://merojosa.dev"
				>Jose Andrés Mejías</a
			>
		</p>
	</div>
</footer>

<style>
	:global(body) {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
</style>

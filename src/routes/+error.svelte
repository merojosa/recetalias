<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
</script>

<div class="flex flex-col items-center justify-center gap-5 h-[65vh] md:h-[55vh]">
	<h1 class="text-9xl font-bold text-gray-800">{page.status}</h1>
	<div class="text-center">
		{#if page.status === 404}
			<p class="text-2xl font-semibold text-gray-700">Página no encontrada</p>
		{:else}
			<p class="text-2xl font-semibold text-gray-700">Ha ocurrido un error</p>
		{/if}
	</div>
	<a
		href={resolve('/')}
		class="rounded-lg bg-gray-800 px-6 py-3 text-white transition hover:bg-gray-700"
	>
		Volver al inicio
	</a>
</div>

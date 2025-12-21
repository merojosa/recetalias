<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
</script>

<div class="flex flex-col items-center justify-center gap-5 h-full">
	<h1 class="text-9xl font-bold text-gray-800">{page.status}</h1>
	<div class="text-center">
		<p class="text-2xl font-semibold text-gray-700">
			{page.status === 404 ? 'Página no encontrada' : 'Error'}
		</p>
		<p class="text-gray-600">
			{page.error?.message || 'Algo salió mal'}
		</p>
	</div>
	<a
		href={resolve('/')}
		class="rounded-lg bg-gray-800 px-6 py-3 text-white transition hover:bg-gray-700"
	>
		Volver al inicio
	</a>
</div>

<style>
	:global(main) {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
</style>

<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="flex min-h-screen flex-col items-center justify-center px-4">
	<h1 class="text-9xl font-bold text-gray-800">{page.status}</h1>
	<p class="mt-4 text-2xl font-semibold text-gray-700">
		{page.status === 404 ? 'Página no encontrada' : 'Error'}
	</p>
	<p class="mt-2 text-gray-600">
		{page.error?.message || 'Algo salió mal'}
	</p>
	<a href="/" class="mt-8 rounded-lg bg-gray-800 px-6 py-3 text-white transition hover:bg-gray-700">
		Volver al inicio
	</a>
</div>

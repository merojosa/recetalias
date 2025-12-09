<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.recipe.title} - Recetalias</title>
</svelte:head>

<article class="flex gap-4 flex-col">
	<section>
		<h1 class="text-5xl font-bold">{data.recipe.title}</h1>
		<p>
			Publicado el <time datetime={data.recipe.date}
				>{new Date(data.recipe.date).toLocaleDateString()}</time
			>
		</p>
		<img src={data.recipe.image.url} alt={data.recipe.image.alt} />
	</section>

	<section>
		<h2 class="text-3xl">Ingredientes</h2>
		<ul>
			{#each data.recipe.ingredients as ingredient (ingredient.id)}
				<li>{ingredient.name}</li>
			{/each}
		</ul>
	</section>

	<section>
		<h2 class="text-3xl">Instrucciones</h2>
		<ol class="list-decimal">
			{#each data.recipe.instructions as instruction (instruction)}
				<li class="pb-2">{instruction}</li>
			{/each}
		</ol>
	</section>
</article>

<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.recipe.title} - Recetalias</title>
</svelte:head>

<article class="flex gap-6 flex-col">
	<section>
		<h1 class="text-3xl md:text-4xl font-bold leading-tight">{data.recipe.title} jejee</h1>
		<p>
			Publicado el <time datetime={data.recipe.date}
				>{new Date(data.recipe.date).toLocaleDateString()}</time
			>
		</p>
		<img class="py-6" src={data.recipe.image.url} alt={data.recipe.image.alt} />

		{#if data.recipe.description}
			<p>{data.recipe.description}</p>
		{/if}
	</section>

	<section>
		<h2 class="text-2xl md:text-3xl pb-3">Ingredientes</h2>
		<ul class="flex flex-col gap-4">
			{#each data.recipe.ingredients as ingredient (`${ingredient.ingredientDetail}-${ingredient.ingredientId}`)}
				<li>{ingredient.ingredientDetail}</li>
			{/each}
		</ul>
	</section>

	<section>
		<h2 class="text-2xl md:text-3xl pb-3">Instrucciones</h2>
		<ol class="flex flex-col gap-4 list-decimal list-inside md:list-outside">
			{#each data.recipe.instructions as instruction (instruction)}
				<li>{instruction}</li>
			{/each}
		</ol>
	</section>
</article>

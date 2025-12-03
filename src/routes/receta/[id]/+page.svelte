<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.recipe.title} - Recetalias</title>
</svelte:head>

<article>
	<h1>{data.recipe.title}</h1>

	{#if data.recipe.image}
		<img src={data.recipe.image.url} alt={data.recipe.image.alt} />
	{/if}

	<p>
		<time datetime={data.recipe.date}>{new Date(data.recipe.date).toLocaleDateString()}</time>
	</p>

	<section>
		<h2>Ingredients</h2>
		<ul>
			{#each data.recipe.ingredients as ingredient (ingredient)}
				<li>{ingredient}</li>
			{/each}
		</ul>
	</section>

	<section>
		<h2>Instructions</h2>
		<ol>
			{#each data.recipe.instructions as instruction (instruction)}
				<li>{instruction}</li>
			{/each}
		</ol>
	</section>
</article>

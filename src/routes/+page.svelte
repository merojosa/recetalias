<script lang="ts">
	import recipesData from '$lib/test-data/recipes.json';
	import { resolve } from '$app/paths';

	const recipes = recipesData.recipes;
</script>

<section class="grid grid-cols-1 gap-8 md:grid-cols-2">
	{#each recipes as recipe (recipe.id)}
		<article>
			<a class="flex gap-1 flex-col" href={resolve(`/recetas/${recipe.id}`)}>
				{#if recipe.image}
					<img
						src={recipe.image.url}
						alt={recipe.image.alt}
						class="aspect-4/3 w-full object-cover"
					/>
				{/if}
				<h2 class="font-bold text-xl my">{recipe.title}</h2>
			</a>
		</article>
	{/each}
</section>

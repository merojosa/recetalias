<script lang="ts">
	import recipesData from '$lib/test-data/recipes.json';
	import ingredientsData from '$lib/test-data/ingredients.json';
	import { resolve } from '$app/paths';
	import * as Select from '$lib/components/ui/select/index';

	let ingredientsValues = $state([] as string[]);

	const ingredients = ingredientsData.ingredients.toSorted((a, b) => a.name.localeCompare(b.name));
	const recipes = $derived.by(() => {
		if (ingredientsValues.length === 0) {
			return recipesData.recipes;
		}

		const recipesToReturn = [] as typeof recipesData.recipes;
		for (const recipe of recipesData.recipes) {
			const found = recipe.ingredients.find((ingredientRecord) =>
				ingredientsValues.includes(ingredientRecord.ingredient)
			);

			if (found) {
				recipesToReturn.push(recipe);
			}
		}

		return recipesToReturn;
	});

	const triggerContent = $derived(
		ingredientsValues.reduce((seed, current) => {
			const found = ingredients.find((ingredient) => ingredient.id === current);

			if (found) {
				return seed === '' ? found.name : `${seed}, ${found.name}`;
			}

			return seed;
		}, '') || 'Seleccione ingredientes para buscar'
	);
</script>

<section>
	<h1 class="text-2xl">Búsqueda de recetas por ingredientes</h1>
	<Select.Root type="multiple" bind:value={ingredientsValues}>
		<Select.Trigger class="w-full">
			{triggerContent}
		</Select.Trigger>
		<Select.Content>
			{#each ingredients as ingredient (ingredient.id)}
				<Select.Item value={ingredient.id} label={ingredient.name}>
					{ingredient.name}
				</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
</section>

<section class="grid grid-cols-1 gap-8 md:grid-cols-2 pt-8">
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
				<h2 class="text-xl my">{recipe.title}</h2>
			</a>
		</article>
	{/each}
</section>

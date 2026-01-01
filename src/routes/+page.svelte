<script lang="ts">
	import recipesData from '$lib/data/recipes.json';
	import ingredientsData from '$lib/data/ingredients.json';
	import { resolve } from '$app/paths';
	import * as Select from '$lib/components/ui/select/index';

	let selectedIngredients = $state([] as string[]);

	const ingredientsFromData = ingredientsData.ingredients.toSorted((a, b) =>
		a.name.localeCompare(b.name)
	);

	const filteredRecipes = $derived.by(() => {
		if (selectedIngredients.length === 0) {
			return recipesData.recipes;
		}

		const recipesToReturn = [] as typeof recipesData.recipes;
		for (const recipe of recipesData.recipes) {
			let matchedSelectedIngredients = true;
			let ingredientsValuesIndex = 0;

			while (
				matchedSelectedIngredients === true &&
				selectedIngredients[ingredientsValuesIndex] !== undefined
			) {
				const foundSelectedIngredient = recipe.ingredients.find(
					(recipeIngredient) =>
						recipeIngredient.ingredientId === selectedIngredients[ingredientsValuesIndex]
				);

				if (!foundSelectedIngredient) {
					matchedSelectedIngredients = false;
				}

				++ingredientsValuesIndex;
			}

			if (matchedSelectedIngredients) {
				recipesToReturn.push(recipe);
			}
		}

		return recipesToReturn;
	});

	const triggerContent = $derived(
		selectedIngredients.reduce((seed, current) => {
			const found = ingredientsFromData.find((ingredient) => ingredient.id === current);

			if (found) {
				return seed === '' ? found.name : `${seed}, ${found.name}`;
			}

			return seed;
		}, '') || 'Seleccione ingredientes para buscar'
	);
</script>

<svelte:head>
	<title>Búsqueda de recetas por ingredientes - Recetalias</title>
</svelte:head>

<section class="w-full flex flex-col gap-2">
	<h1 class="text-2xl">Búsqueda de recetas por ingredientes</h1>
	<Select.Root type="multiple" bind:value={selectedIngredients}>
		<Select.Trigger class="w-full">
			{triggerContent}
		</Select.Trigger>
		<Select.Content>
			{#each ingredientsFromData as ingredient (ingredient.id)}
				<Select.Item value={ingredient.id} label={ingredient.name}>
					{ingredient.name}
				</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
</section>

<section class="grid grid-cols-1 gap-8 sm:grid-cols-2 pt-8 w-full">
	{#each filteredRecipes as recipe (recipe.id)}
		<article>
			<a class="flex gap-1 flex-col relative" href={resolve(`/recetas/${recipe.id}`)}>
				{#if recipe.image}
					<img src={recipe.image.url} alt={recipe.image.alt} class="aspect-4/3 object-cover" />
					<div
						class="absolute bottom-0 left-0 right-0 h-1/2 bg-linear-to-t from-black/80 to-transparent pointer-events-none"
					></div>
					<h2
						class="line-clamp-2 absolute bottom-4 left-0 right-0 text-xl text-white px-4 font-bold"
					>
						{recipe.title}
					</h2>
				{/if}
			</a>
		</article>
	{/each}
</section>

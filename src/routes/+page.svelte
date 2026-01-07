<script module lang="ts">
	const OG_TITLE = 'Búsqueda de recetas por ingredientes - Recetalias';
	const OG_DESCRIPTION = 'Recetas de cocina fáciles y sencillas. ¡Busque por ingredientes!';
	const OG_IMAGE = 'https://recetalias.com/og-image.png';
	const OG_URL = 'https://recetalias.com';
</script>

<script lang="ts">
	import recipesData from '$lib/data/recipes.json';
	import ingredientsData from '$lib/data/ingredients.json';
	import { resolve } from '$app/paths';
	import * as Select from '$lib/components/ui/select/index';
	import { Input } from '$lib/components/ui/input/index';
	import SearchIcon from '@lucide/svelte/icons/search';

	let selectedIngredients = $state([] as string[]);
	let selectOpen = $state(false);
	let searchIngredientsText = $state('');
	let searchInputRef = $state<HTMLInputElement | null>(null);

	const ingredientsFromData = ingredientsData.ingredients.toSorted((a, b) =>
		a.name.localeCompare(b.name)
	);

	const filteredRecipes = $derived.by(() => {
		if (selectedIngredients.length === 0) {
			return recipesData.recipes.toSorted(
				(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
			);
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

		return recipesToReturn.toSorted(
			(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
		);
	});

	const filteredIngredients = $derived.by(() => {
		if (searchIngredientsText) {
			const normalizedSearch = normalizeText(searchIngredientsText);
			return ingredientsFromData.filter((ingredient) =>
				normalizeText(ingredient.name).includes(normalizedSearch)
			);
		}

		return ingredientsFromData;
	});

	const triggerContent = $derived(
		selectedIngredients.reduce((seed, current) => {
			const found = ingredientsFromData.find((ingredient) => ingredient.id === current);

			if (found) {
				return seed === '' ? found.name : `${seed}, ${found.name}`;
			}

			return seed;
		}, '') || 'Seleccione ingredientes'
	);

	function normalizeText(text: string): string {
		return text
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.toLowerCase();
	}

	$effect(() => {
		if (selectOpen && searchInputRef) {
			// Use requestAnimationFrame to ensure DOM is ready and avoid focus conflicts
			requestAnimationFrame(() => {
				searchInputRef?.focus();
			});
		}
	});
</script>

<svelte:head>
	<title>{OG_TITLE}</title>
	<meta name="description" content={OG_DESCRIPTION} />

	<!-- Open Graph / Facebook / Instagram / WhatsApp / Telegram -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={OG_URL} />
	<meta property="og:title" content={OG_TITLE} />
	<meta property="og:description" content={OG_DESCRIPTION} />
	<meta property="og:image" content={OG_IMAGE} />
	<meta property="og:site_name" content="Recetalias" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={OG_URL} />
	<meta name="twitter:title" content={OG_TITLE} />
	<meta name="twitter:description" content={OG_DESCRIPTION} />
	<meta name="twitter:image" content={OG_IMAGE} />

	<!-- BlueSky (uses Open Graph) -->
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
</svelte:head>

<section class="w-full flex flex-col gap-2">
	<h1 class="text-2xl">Búsqueda de recetas por ingredientes</h1>
	<Select.Root type="multiple" bind:value={selectedIngredients} bind:open={selectOpen}>
		<Select.Trigger
			class="w-full text-left whitespace-normal! h-auto! min-h-9 py-2"
			clear={selectedIngredients.length > 0}
			onClear={() => (selectedIngredients = [])}
		>
			<span class="block">
				{triggerContent}
			</span>
		</Select.Trigger>
		<Select.Content class="h-[22vh]">
			<div class="flex items-center pb-2">
				<SearchIcon class="h-4" />
				<Input
					bind:ref={searchInputRef}
					class="border-0 shadow-none focus-visible:ring-0 pl-1"
					placeholder="Ingrese un ingrediente"
					bind:value={searchIngredientsText}
				/>
			</div>
			{#each filteredIngredients as ingredient (ingredient.id)}
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

<script lang="ts">
	import { browser } from '$app/environment';
	import Checkbox from '$lib/components/custom/Checkbox.svelte';

	let { data } = $props();

	const storageKey = $derived(`recipe-checkboxes-${data.recipe.id}`);

	// Load initial state from session storage
	function loadCheckedState(): Record<string, boolean> {
		if (!browser) return {};
		const stored = sessionStorage.getItem(storageKey);
		return stored ? JSON.parse(stored) : {};
	}

	let checkedIngredients = $state<Record<string, boolean>>(loadCheckedState());

	// Persist to session storage when state changes
	$effect(() => {
		if (browser) {
			sessionStorage.setItem(storageKey, JSON.stringify(checkedIngredients));
		}
	});

	const ogTitle = $derived(`${data.recipe.title} - Recetalias`);
	const ogDescription = $derived(data.recipe.description);
	const ogImage = $derived(
		data.recipe.image.url.startsWith('http')
			? data.recipe.image.url
			: `https://recetalias.com${data.recipe.image.url}`
	);
	const ogUrl = $derived(`https://recetalias.com/recetas/${data.recipe.id}`);
</script>

<svelte:head>
	<title>{ogTitle}</title>
	<meta name="description" content={ogDescription} />

	<!-- Open Graph / Facebook / Instagram / WhatsApp / Telegram -->
	<meta property="og:type" content="article" />
	<meta property="og:url" content={ogUrl} />
	<meta property="og:title" content={ogTitle} />
	<meta property="og:description" content={ogDescription} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:site_name" content="Recetalias" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={ogUrl} />
	<meta name="twitter:title" content={ogTitle} />
	<meta name="twitter:description" content={ogDescription} />
	<meta name="twitter:image" content={ogImage} />

	<!-- BlueSky (uses Open Graph) -->
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
</svelte:head>

<article class="flex gap-6 flex-col">
	<section>
		<h1 class="text-3xl md:text-4xl font-bold leading-tight">{data.recipe.title}</h1>
		<p>
			Publicado el <time datetime={data.recipe.date}
				>{new Date(data.recipe.date).toLocaleDateString()}</time
			>
		</p>
		<img class="py-6" src={data.recipe.image.url} alt={data.recipe.image.alt} />
		<p>{data.recipe.description}</p>
	</section>

	<section>
		<h2 class="text-2xl md:text-3xl pb-3">Ingredientes</h2>
		<ul class="flex flex-col gap-4">
			{#each data.recipe.ingredients as ingredient (`${ingredient.ingredientDetail}-${ingredient.ingredientId}`)}
				{@const key = `${ingredient.ingredientDetail}-${ingredient.ingredientId}`}
				<li class="flex gap-2">
					<Checkbox
						class="relative top-1"
						checked={checkedIngredients[key] ?? false}
						onchange={(e: Event) =>
							(checkedIngredients[key] = (e.currentTarget as HTMLInputElement).checked)}
					/>
					{ingredient.ingredientDetail}
				</li>
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

import * as v from 'valibot';
import { error } from '@sveltejs/kit';
import snarkdown from 'snarkdown';
import { RecipesFileSchema, type Recipe } from '$lib/schemas/recipe';
import type { EntryGenerator, PageLoad } from './$types';

function markdownToHtml(md: string): string {
	return snarkdown(md);
}

function stripMarkdown(md: string): string {
	return md
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [text](url) → text
		.replace(/[*_]{1,3}(.+?)[*_]{1,3}/g, '$1') // bold/italic → text
		.trim();
}

export const entries: EntryGenerator = async () => {
	const recipesData = await import('$lib/data/recipes.json');
	const validatedData = v.parse(RecipesFileSchema, recipesData.default);
	return validatedData.recipes.map((recipe) => ({ id: recipe.id }));
};

export const load: PageLoad = async ({ params }) => {
	const recipesData = await import('$lib/data/recipes.json');
	const validatedData = v.parse(RecipesFileSchema, recipesData.default);

	const recipe = validatedData.recipes.find((r) => r.id === params.id) as Recipe | undefined;

	if (!recipe) {
		error(404, 'Recipe not found');
	}

	return {
		recipe,
		descriptionHtml: markdownToHtml(recipe.description),
		ogDescription: stripMarkdown(recipe.description)
	};
};

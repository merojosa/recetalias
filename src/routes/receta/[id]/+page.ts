import * as v from 'valibot';
import { RecipesSchema, type Recipe } from '$lib/schemas/recipe';

export const prerender = true;

export const entries = async () => {
	const recipes = await import('$lib/test-data/recipes.json');
	const validatedRecipes = v.parse(RecipesSchema, recipes.default);
	return Object.keys(validatedRecipes).map((id) => ({ id }));
};

export const load = async ({ params }) => {
	const recipes = await import('$lib/test-data/recipes.json');
	const validatedRecipes = v.parse(RecipesSchema, recipes.default);

	const recipe = validatedRecipes[params.id] as Recipe | undefined;

	if (recipe) {
		return { recipe };
	}
	throw new Error('Recipe not found');
};

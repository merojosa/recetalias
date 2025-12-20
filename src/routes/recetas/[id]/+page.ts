import * as v from 'valibot';
import { RecipesFileSchema, type Recipe } from '$lib/schemas/recipe';
import type { EntryGenerator, PageLoad } from './$types';

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
		throw new Error('Recipe not found');
	}

	const ingredientsData = await import('$lib/data/ingredients.json');

	const recipeWithIngredientsData = {
		...structuredClone(recipe),
		ingredients: recipe.ingredients.map((ingredientObject) => {
			const ingredientFound = ingredientsData.ingredients.find(
				(value) => value.id === ingredientObject.ingredient
			);
			if (!ingredientFound) {
				throw new Error('Ingredient not found ' + ingredientObject);
			}
			return {
				id: ingredientObject,
				name: ingredientFound.name,
				quantity: ingredientObject.quantity
			};
		})
	};

	return { recipe: recipeWithIngredientsData };
};

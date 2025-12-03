import * as v from 'valibot';
import ingredientsData from '$lib/test-data/ingredients.json';

const validIngredients = Object.keys(ingredientsData);

export const RecipeImageSchema = v.object({
	url: v.pipe(v.string(), v.url()),
	alt: v.string()
});

export const RecipeSchema = v.object({
	title: v.string(),
	ingredients: v.pipe(
		v.array(v.pipe(v.string(), v.picklist(validIngredients))),
		v.check((arr) => new Set(arr).size === arr.length, 'Ingredients must not contain duplicates')
	),
	date: v.pipe(v.string(), v.isoDate()),
	image: RecipeImageSchema,
	instructions: v.array(v.string())
});

export const RecipesSchema = v.record(v.string(), RecipeSchema);

export type Recipe = v.InferOutput<typeof RecipeSchema>;
export type RecipeImage = v.InferOutput<typeof RecipeImageSchema>;
export type Recipes = v.InferOutput<typeof RecipesSchema>;

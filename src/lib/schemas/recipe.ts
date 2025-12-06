import * as v from 'valibot';
import ingredientsData from '$lib/test-data/ingredients.json';

const validIngredients = ingredientsData.ingredients.map((ingredient) => ingredient.id);

export const RecipeImageSchema = v.object({
	url: v.string(),
	alt: v.string()
});

export const RecipeSchema = v.object({
	id: v.string(),
	title: v.string(),
	ingredients: v.pipe(
		v.array(v.pipe(v.string(), v.picklist(validIngredients))),
		v.check((arr) => new Set(arr).size === arr.length, 'Ingredients must not contain duplicates')
	),
	date: v.pipe(v.string(), v.isoDate()),
	image: RecipeImageSchema,
	instructions: v.pipe(v.array(v.string()), v.minLength(1, 'At least one instruction is required'))
});

export const RecipesFileSchema = v.object({
	recipes: v.pipe(
		v.array(RecipeSchema),
		v.check((recipes) => {
			const ids = recipes.map((r) => r.id);
			return new Set(ids).size === ids.length;
		}, 'Recipe IDs must be unique')
	)
});

export type Recipe = v.InferOutput<typeof RecipeSchema>;
export type RecipeImage = v.InferOutput<typeof RecipeImageSchema>;
export type RecipesFile = v.InferOutput<typeof RecipesFileSchema>;

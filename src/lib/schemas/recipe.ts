import * as v from 'valibot';
import ingredientsData from '$lib/data/ingredients.json';

const validIngredients = ingredientsData.ingredients.map((ingredient) => ingredient.id);

const RecipeImageSchema = v.object({
	url: v.string(),
	alt: v.string()
});

const RecipeIngredientSchema = v.object({
	ingredientId: v.pipe(v.string(), v.picklist(validIngredients)),
	ingredientDetail: v.string()
});

const RecipeSchema = v.object({
	id: v.string(),
	title: v.string(),
	description: v.pipe(v.string(), v.minLength(1)),
	ingredients: v.pipe(
		v.array(RecipeIngredientSchema),
		v.minLength(1, 'At least one ingredient is required'),
		v.check(
			(arr) => new Set(arr.map((i) => i.ingredientId)).size === arr.length,
			'Ingredients must not contain duplicates'
		)
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

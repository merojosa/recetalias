export const prerender = true;

export async function entries() {
	const recipes = await import('$lib/data/recipes.json');
	return Object.keys(recipes.default).map((id) => ({ id }));
}

export async function load({ params }) {
	const recipes = await import('$lib/data/recipes.json');

	const recipeResult = Object.entries(recipes.default).find(([id]) => id === params.id);

	if (recipeResult) {
		const [, recipe] = recipeResult;
		return { recipe };
	}
	throw new Error('Recipe not found');
}

import { test, expect } from '@playwright/test';
import recipesData from '../src/lib/data/recipes.json' with { type: 'json' };
import ingredientsData from '../src/lib/data/ingredients.json' with { type: 'json' };

test.describe('Homepage', () => {
	test('displays recipes', async ({ page }) => {
		await page.goto('/');

		await expect(page).toHaveTitle(/Búsqueda de recetas por ingredientes - Recetalias/);
		await expect(page.getByRole('heading', { level: 1 })).toHaveText(
			'Búsqueda de recetas por ingredientes'
		);

		// Verify at least one recipe is properly displayed:
		const recipes = page.locator('article');
		await expect(recipes).not.toHaveCount(0);
		const firstRecipe = recipes.first();
		await expect(firstRecipe.locator('h2')).toBeVisible();
		await expect(firstRecipe.locator('a')).toHaveAttribute('href', /\/recetas\//);
	});

	test('searches recipes by ingredients', async ({ page }) => {
		await page.goto('/');

		const ingredient1 = ingredientsData.ingredients.find((ing) => ing.id === 'azucar');
		const ingredient2 = ingredientsData.ingredients.find((ing) => ing.id === 'limon');

		if (!ingredient1 || !ingredient2) {
			throw new Error('Required ingredients not found in ingredients.json');
		}

		const testRecipe = recipesData.recipes.find(
			(recipe) =>
				recipe.ingredients.some((ing) => ing.ingredientId === ingredient1.id) &&
				recipe.ingredients.some((ing) => ing.ingredientId === ingredient2.id)
		);

		if (!testRecipe) {
			throw new Error(
				`No recipe found with both ${ingredient1.name} and ${ingredient2.name} ingredients`
			);
		}

		const recipes = page.locator('article');
		await expect(recipes.first()).toBeVisible();
		const initialCount = await recipes.count();
		expect(initialCount).toBeGreaterThan(0);

		const trigger = page.locator('[data-slot="select-trigger"]');
		await trigger.click();

		const option1 = page.getByRole('option', { name: ingredient1.name });
		await expect(option1).toBeVisible();
		await option1.click();
		await expect(page.getByRole('heading', { name: testRecipe.title })).toBeVisible();

		const option2 = page.getByRole('option', { name: ingredient2.name });
		await expect(option2).toBeVisible();
		await option2.click();
		await expect(page.getByRole('heading', { name: testRecipe.title })).toBeVisible();
	});
});

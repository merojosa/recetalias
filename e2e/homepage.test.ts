import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
	test('displays recipes', async ({ page }) => {
		await page.goto('/');

		await expect(page).toHaveTitle(/Búsqueda de recetas por ingredientes - jejeRecetalias/);
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
});

import { test, expect } from '@playwright/test';

test.describe('Recipe detail page', () => {
	test('navigates from home and displays recipe details', async ({ page }) => {
		await page.goto('/');

		// Click first recipe link
		const firstRecipeLink = page.locator('article a').first();
		await firstRecipeLink.click();

		// Wait for navigation
		await page.waitForURL(/\/recetas\/.+/);

		// Title
		const h1 = page.getByRole('heading', { level: 1 });
		await expect(h1).toBeVisible();

		const h1Text = await h1.textContent();
		expect(h1Text).toBeTruthy();
		await expect(page).toHaveTitle(`${h1Text} - Recetalias`);

		// Ingredients
		const ingredientsHeading = page.getByRole('heading', { name: 'Ingredientes' });
		await expect(ingredientsHeading).toBeVisible();

		const ingredients = ingredientsHeading.locator('..').locator('ul li');
		await expect(ingredients.first()).toBeVisible();

		// Instructions
		const instructionsHeading = page.getByRole('heading', { name: 'Instrucciones' });
		await expect(instructionsHeading).toBeVisible();

		const instructions = instructionsHeading.locator('..').locator('ol li');
		await expect(instructions.first()).toBeVisible();
	});
});

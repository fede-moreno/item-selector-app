import { expect, test } from '@playwright/test';

test('has selected Ids', async ({ page }) => {
  await page.goto('/');

  const locator = page.locator('app-item-selector-container > div > div > p');
  await expect(locator).toHaveText(' Selected item IDs:  None ');
});

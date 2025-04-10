/* import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
 */
 
 import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://github.com/');
  await page.getByRole('link', { name: 'Sign in' }).click();
  await page.getByRole('textbox', { name: 'Username or email address' }).click();
  await page.getByRole('textbox', { name: 'Username or email address' }).fill('i.f.balae@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Ribozom1!');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('link', { label: 'tert0s' })).toBeVisible;
  await page.getByLabel('Account').getByLabel('Repositories', { exact: true }).getByRole('link', { name: 'tert0s/appdemo' }).click();
  await page.click('#issues-tab');
  await page.getByRole('link', { name: 'New issue' }).click();
  await page.getByRole('textbox', { name: 'Add a title' }).fill('test1');
  await page.getByRole('textbox', { name: 'Markdown value' }).click();
  await page.getByRole('textbox', { name: 'Markdown value' }).fill('next');
  await page.getByTestId('create-issue-button').click();
  await expect(page.getByRole('button', { name: 'Close issue' })).toBeVisible();
});
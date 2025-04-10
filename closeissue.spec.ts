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
  await page.getByRole('link', { name: 'newTicket', exact: true }).click();
  await page.getByRole('button', { name: 'Close issue' }).click();	
  await expect(page.getByRole('button', { name: 'Reopen Issue' })).toBeVisible();
});
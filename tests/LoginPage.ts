import { Page } from '@playwright/test';

export class LoginPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Method to navigate to the login page
  async navigateToLoginPage(url: string): Promise<void> {
    await this.page.goto(url);
  }

  // Method to fill in username //to continue here
  async enterUsername(username: string): Promise<void> {
	const usernameField = this.page.getByRole('textbox', { name: 'Username or email address' });
	await usernameField.click();
	await usernameField.fill(username);
  }

  // Method to fill in password //to continue here
  async enterPassword(password: string): Promise<void> {
    const passwordField = this.page.getByRole('textbox', { name: 'Password' });
    await passwordField.click();
    await passwordField.fill(password);
  }

  // Method to click the login button
  async clickLoginButton(): Promise<void> {
    const loginButton= this.page.getByRole('button', { name: 'Sign in', exact: true });
	await loginButton.click()
  }
  
  // confirm login
  
  //expect page to be

  // Combined method for performing the login action
  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }
}
import { test, expect, request } from '@playwright/test';
import * as dotenv from 'dotenv';
import { LoginPage } from './LoginPage';
import { waitForApiStatus } from '../utils/apiUtils';

// Load environment variables from the .env file
dotenv.config();

test.describe('GitHub UI Test with API Verification', () => {
  // Repository details
  const repoOwner = 'tert0s'; // Replace with your GitHub username
  const repoName = 'appDemo'; // Replace with your repository name

  // Issue details
  const issueTitle = 'UndesiredEffectCausedByLastAction';
  const issueBody = 'ListOfStepsFollowedByExpectedAndActualResult';
  const githubBaseURL = 'https://github.com';

  // GitHub credentials loaded from environment variables
  const githubUsername = process.env.ACC_USERNAME; // Read GitHub username from environment variables
  const githubPassword = process.env.ACC_PASSWORD; // Read GitHub password from environment variables
  const githubToken = process.env.API_TOKEN; // Read GitHub personal access token for API calls
  // API context
  let apiContext;
  
  test.beforeAll(async () => {
    // Initialize a reusable API request context
	  
    apiContext = await request.newContext({
      baseURL: 'https://api.github.com',
      extraHTTPHeaders: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });
  });

  test.afterAll(async () => {
    // Dispose of the API context after all tests //Why does it dispose before exiting Test?
    //await apiContext.dispose();
  });
  
  test('Create and Close an Issue via GitHub UI with API Verification', async ({ page }) => {	   
    // Step 1: Ensure credentials are available
    if (!githubUsername || !githubPassword || !githubToken) {
      throw new Error('GitHub credentials or token are missing. Please set ACC_USERNAME, ACC_PASSWORD, and GITHUB_TOKEN in your .env file.');
    }

    // Step 2: Log in to GitHub
	const loginPage = new LoginPage(page);
	await loginPage.navigateToLoginPage(`${githubBaseURL}/login`);
	await loginPage.login(githubUsername, githubPassword);
	// await page.goto(`${githubBaseURL}/login`);
    // await page.fill('input[name="login"]', githubUsername);
    // await page.fill('input[name="password"]', githubPassword);
    // await page.click('input[type="submit"]');	
    // await expect(page.getByRole('link', { label: 'tert0s' })).toBeVisible;
	
	// Step 3: "Navigate" //to continue here
	await page.goto(`${githubBaseURL}/${repoOwner}/${repoName}/issues/new`); 

    // Step 4: Create a new issue
	await page.click('[placeholder="Title"]');
	await page.fill('[placeholder="Title"]', issueTitle);
	await page.click('[placeholder="Type your description here…"]');
    await page.fill('[placeholder="Type your description here…"]', issueBody);
	await page.click('[data-testid="create-issue-button"]');	
	//await page. waitForTimeout(3000);
	
    // Verify the issue was created
    await expect(page.locator('bdi[data-testid="issue-title"]')).toHaveText(issueTitle);

    // Fetch the issue number from the URL
    const issueUrl = page.url();
    const issueNumber = issueUrl.split('/').pop();
    console.log(`Created issue number: ${issueNumber}`);

    // Step 5: Close the issue
    await page.getByRole('button', { name: 'Close issue' }).click(); // Click the "Close issue" button
    //await page.getByRole('button', { name: 'Reopen Issue' }).toBeVisible; // Wait for the issue to be closed

    // Verify the issue was closed in the UI
    const issueState = await page.getByRole('button', { name: 'Reopen Issue' });
    expect(issueState).toBeDefined(); // Ensure the "Closed" status is visible

    // Step 6: Verify the issue is closed via GitHub API
	const apiUrl =(`/repos/${repoOwner}/${repoName}/issues/${issueNumber}`);
	
	// Step 7: Wait for issue to be closed
	await waitForApiStatus(apiContext, apiUrl, 'closed', 15000, 2000);
    console.log(`Verified via API: Issue #${issueNumber} is closed.`);
  });
});
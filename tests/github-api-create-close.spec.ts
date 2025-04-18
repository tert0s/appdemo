import { test, request, expect } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

test.describe('GitHub API Test', () => {
	let apiContext;
	const apiToken = process.env.API_TOKEN;

  test.beforeAll(async () => {
    // Initialize a reusable API request context
	  
    apiContext = await request.newContext({
      baseURL: 'https://api.github.com',
      extraHTTPHeaders: {
        'Authorization': `Bearer ${apiToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });
  });

  test.afterAll(async () => {
    // Dispose of the API context after all tests
    await apiContext.dispose();
  });

  test('should create and close a GitHub issue', async () => {
    const repoOwner = 'tert0s'; // Replace with your GitHub username
    const repoName = 'appDemo'; // Replace with your repository name
    const issueTitle = 'Temporary Issue for Testing';
    const issueBody = 'This issue will be closed after creation.';

    // Step 1: Create an issue
    const createResponse = await apiContext.post(`/repos/${repoOwner}/${repoName}/issues`, {
      data: {
        title: issueTitle,
        body: issueBody,
      },
    });

    expect(createResponse.ok()).toBeTruthy(); // Ensure the issue was created successfully
    const createdIssue = await createResponse.json();
    console.log(`Issue created: ${createdIssue.html_url}`);

    // Additional validation
    expect(createdIssue.title).toBe(issueTitle);
    expect(createdIssue.body).toBe(issueBody);

    // Step 2: Close the issue
    const issueNumber = createdIssue.number;
    const closeResponse = await apiContext.patch(`/repos/${repoOwner}/${repoName}/issues/${issueNumber}`, {
      data: {
        state: 'closed',
      },
    });

    expect(closeResponse.ok()).toBeTruthy(); // Ensure the issue was closed successfully
    const closedIssue = await closeResponse.json();
    console.log(`Issue closed successfully: ${closedIssue.html_url}`);

    // Additional validation for closed state
    expect(closedIssue.state).toBe('closed');
  });
});
import { expect, request } from '@playwright/test';

async function waitForApiStatus(apiContext: any, apiUrl: string, expectedStatus: string, timeout: number = 10000, interval: number = 1000) {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const response = await apiContext.get(apiUrl);
    expect(response.ok()).toBeTruthy(); // Ensure the API call is successful
    const responseData = await response.json();

    if (responseData.state === expectedStatus) {
      console.log(`API status updated to '${expectedStatus}'`);
      return; // Exit the function once the status matches
    }

    // Wait for the interval before checking again
    await new Promise(resolve => setTimeout(resolve, interval));
  }

  throw new Error(`API status did not update to '${expectedStatus}' within ${timeout}ms`);
}
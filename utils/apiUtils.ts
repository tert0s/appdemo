import { APIRequestContext } from '@playwright/test';

/**
 * Waits for a specific status from the API within a given timeout period.
 * 
 * @param apiContext - The APIRequestContext instance to make API calls.
 * @param apiUrl - The API endpoint to poll.
 * @param expectedStatus - The target status to wait for (e.g., 'closed').
 * @param timeout - Maximum time (in ms) to wait for the status update (default: 10 seconds).
 * @param interval - Time (in ms) between each API poll (default: 1 second).
 */
export async function waitForApiStatus(
  apiContext: APIRequestContext,
  apiUrl: string,
  expectedStatus: string,
  timeout: number = 10000,
  interval: number = 1000
): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const response = await apiContext.get(apiUrl);
    if (!response.ok()) {
      throw new Error(`API call failed with status: ${response.status()}`);
    }

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
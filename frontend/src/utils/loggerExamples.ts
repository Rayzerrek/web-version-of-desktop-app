import { logger } from '../utils/logger';

export function exampleBasicLogging() {
  logger.log("User logged in");
  
  logger.error("Login failed:", new Error("Invalid credentials"));
  
  logger.warn("Session expiring soon");
}

export async function exampleTryCatch() {
  try {
    const data = await fetchData();
    logger.log("Data fetched successfully:", data);
  } catch (error) {
    logger.error("Failed to fetch data:", error);
    showToast("Nie udało się załadować danych", "error");
  }
}

export function exampleDebugLogging(userData: any) {
  logger.debug("Processing user data:", {
    id: userData.id,
    timestamp: new Date().toISOString()
  });
  
}

export function exampleConditionalLogging(isSuccess: boolean) {
  if (isSuccess) {
    logger.log("✅ Operation completed successfully");
  } else {
    logger.error("❌ Operation failed");
  }
}

function showToast(_message: string, _type: 'info' | 'error' | 'success') {
}

function fetchData() {
  return Promise.resolve({ data: "example" });
}

#!/usr/bin/env node

/**
 * Przykład użycia logger w kluczowych komponentach
 * Ten plik pokazuje jak używać production-safe logger
 */

import { logger } from '../utils/logger';

// Przykład 1: Podstawowe logowanie
export function exampleBasicLogging() {
  // Zamiast: console.log("User logged in")
  logger.log("User logged in");
  
  // Zamiast: console.error("Login failed:", error)
  logger.error("Login failed:", new Error("Invalid credentials"));
  
  // Zamiast: console.warn("Session expiring soon")
  logger.warn("Session expiring soon");
}

// Przykład 2: Logowanie w try-catch
export async function exampleTryCatch() {
  try {
    const data = await fetchData();
    logger.log("Data fetched successfully:", data);
  } catch (error) {
    logger.error("Failed to fetch data:", error);
    // Pokazuj użytkownikowi przyjazny komunikat
    showToast("Nie udało się załadować danych", "error");
  }
}

// Przykład 3: Debug logging w development
export function exampleDebugLogging(userData: any) {
  logger.debug("Processing user data:", {
    id: userData.id,
    timestamp: new Date().toISOString()
  });
  
  // Ten log pojawi się tylko w development mode
}

// Przykład 4: Warunkowe logowanie
export function exampleConditionalLogging(isSuccess: boolean) {
  if (isSuccess) {
    logger.log("✅ Operation completed successfully");
  } else {
    logger.error("❌ Operation failed");
  }
}

// Helper do pokazywania toastów (przykład)
function showToast(message: string, type: 'info' | 'error' | 'success') {
  // Implementacja toasta
}

function fetchData() {
  return Promise.resolve({ data: "example" });
}

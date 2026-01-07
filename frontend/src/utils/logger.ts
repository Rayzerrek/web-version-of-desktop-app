/**
 * Production-safe logger
 * Automatically disables console logging in production builds
 */

const isProduction = import.meta.env.PROD;

export const logger = {
  log: (...args: any[]) => {
    if (!isProduction) {
      console.log(...args);
    }
  },

  error: (...args: any[]) => {
    if (!isProduction) {
      console.error(...args);
    }
  },

  warn: (...args: any[]) => {
    if (!isProduction) {
      console.warn(...args);
    }
  },

  debug: (...args: any[]) => {
    if (!isProduction) {
      console.debug(...args);
    }
  },

  info: (...args: any[]) => {
    if (!isProduction) {
      console.info(...args);
    }
  }
};

// For development, export a function to check environment
export const isDevelopment = () => !isProduction;
export const isProductionBuild = () => isProduction;

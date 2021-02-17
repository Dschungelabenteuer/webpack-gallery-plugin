export const sanitizePath = (input: string): string => input
  .trim().toLowerCase().replace(/\W|_/gi, '-');

export const normalizePath = (input: string): string => input
  .replace(/\\/g, '/');

export const normalizePaths = (input: string[]): string[] => input
  .map((path) => normalizePath(path));

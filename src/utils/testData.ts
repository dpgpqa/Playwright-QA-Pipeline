import { readFileSync } from 'fs';
import { join } from 'path';
import type { z } from 'zod';

export function loadTestData<T>(fileName: string, schema: z.ZodSchema<T>): T {
  const filePath = join(process.cwd(), 'test-data', fileName);
  const raw = JSON.parse(readFileSync(filePath, 'utf-8'));
  return schema.parse(raw);
}

export function loadJsonFile<T>(fileName: string): T {
  const filePath = join(process.cwd(), 'test-data', fileName);
  return JSON.parse(readFileSync(filePath, 'utf-8')) as T;
}

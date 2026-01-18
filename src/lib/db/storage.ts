import { put, head } from '@vercel/blob';
import fs from 'fs/promises';
import path from 'path';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const DATA_DIR = path.join(process.cwd(), 'src/data');

/**
 * Read data from storage (local JSON file or Vercel Blob)
 * @param filename - Name of the file (e.g., 'teams.json')
 * @param defaultValue - Default value to return if file doesn't exist
 * @returns Parsed data from storage
 */
export async function readData<T>(filename: string, defaultValue: T): Promise<T> {
  try {
    if (IS_PRODUCTION) {
      // Vercel Blob Storage
      try {
        const blob = await head(`${filename}`);
        if (!blob) return defaultValue;
        const response = await fetch(blob.url);
        return await response.json();
      } catch (error) {
        // If blob doesn't exist, return default value
        console.log(`Blob ${filename} not found, returning default value`);
        return defaultValue;
      }
    } else {
      // Local filesystem
      const filePath = path.join(DATA_DIR, filename);
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(content);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
          // File doesn't exist, create it with default value
          await writeData(filename, defaultValue);
          return defaultValue;
        }
        throw error;
      }
    }
  } catch (error) {
    console.error(`Error reading data from ${filename}:`, error);
    throw error;
  }
}

/**
 * Write data to storage (local JSON file or Vercel Blob)
 * @param filename - Name of the file (e.g., 'teams.json')
 * @param data - Data to write
 */
export async function writeData<T>(filename: string, data: T): Promise<void> {
  try {
    const content = JSON.stringify(data, null, 2);

    if (IS_PRODUCTION) {
      // Vercel Blob Storage
      await put(filename, content, {
        access: 'public',
        contentType: 'application/json',
      });
    } else {
      // Local filesystem - atomic write
      const filePath = path.join(DATA_DIR, filename);
      const tempPath = `${filePath}.tmp`;

      // Ensure directory exists
      await fs.mkdir(DATA_DIR, { recursive: true });

      // Write to temp file first
      await fs.writeFile(tempPath, content, 'utf-8');

      // Atomic rename
      await fs.rename(tempPath, filePath);
    }
  } catch (error) {
    console.error(`Error writing data to ${filename}:`, error);
    throw error;
  }
}

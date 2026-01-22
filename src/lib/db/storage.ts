import { put, list } from '@vercel/blob';
import fs from 'fs/promises';
import path from 'path';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const HAS_BLOB_TOKEN = !!process.env.BLOB_READ_WRITE_TOKEN;
const USE_BLOB_STORAGE = IS_PRODUCTION && HAS_BLOB_TOKEN;
const DATA_DIR = path.join(process.cwd(), 'src/data');

// In-memory storage fallback (for production without Blob token)
const inMemoryStorage = new Map<string, string>();

/**
 * Read data from storage (local JSON file, Vercel Blob, or in-memory)
 * @param filename - Name of the file (e.g., 'teams.json')
 * @param defaultValue - Default value to return if file doesn't exist
 * @returns Parsed data from storage
 */
export async function readData<T>(filename: string, defaultValue: T): Promise<T> {
  try {
    if (USE_BLOB_STORAGE) {
      // Vercel Blob Storage (production with token)
      try {
        console.log(`[Blob] Reading ${filename}...`);

        // List blobs to find our file
        const { blobs } = await list({ prefix: filename });

        if (blobs.length === 0) {
          console.log(`[Blob] ${filename} not found, returning default value`);
          return defaultValue;
        }

        // Fetch the blob content
        const blob = blobs[0];
        console.log(`[Blob] Found ${filename} at ${blob.url}`);
        const response = await fetch(blob.url);
        const data = await response.json();
        console.log(`[Blob] Successfully read ${filename}`);
        return data;
      } catch (error) {
        console.error(`[Blob] Error reading ${filename}:`, error);
        return defaultValue;
      }
    } else if (IS_PRODUCTION) {
      // In-memory storage (production without Blob token)
      console.warn(`⚠️  Using in-memory storage. Data will not persist. Set up Vercel Blob Storage for persistence.`);
      const stored = inMemoryStorage.get(filename);
      if (stored) {
        return JSON.parse(stored);
      }
      return defaultValue;
    } else {
      // Local filesystem (development)
      const filePath = path.join(DATA_DIR, filename);
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(content);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
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
 * Write data to storage (local JSON file, Vercel Blob, or in-memory)
 * @param filename - Name of the file (e.g., 'teams.json')
 * @param data - Data to write
 */
export async function writeData<T>(filename: string, data: T): Promise<void> {
  try {
    const content = JSON.stringify(data, null, 2);

    if (USE_BLOB_STORAGE) {
      console.log(`[Blob] Writing to ${filename}...`);

      // Vercel Blob Storage (production with token)
      const blob = await put(filename, content, {
        access: 'public',
        contentType: 'application/json',
        addRandomSuffix: false, // Keep exact filename for consistent reads
      });

      console.log(`[Blob] Successfully wrote ${filename} to ${blob.url}`);
    } else if (IS_PRODUCTION) {
      // In-memory storage (production without Blob token)
      console.warn(`⚠️  Using in-memory storage. Data will not persist. Set up Vercel Blob Storage for persistence.`);
      inMemoryStorage.set(filename, content);
    } else {
      // Local filesystem - atomic write (development)
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

import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import path from 'node:path';

import * as schema from './schema';

const databasePath = path.join(
  process.cwd(),
  'server',
  'data',
  'readbetween.db',
);

const sqlite = new Database(databasePath);

export const db = drizzle(sqlite, {
  schema,
});
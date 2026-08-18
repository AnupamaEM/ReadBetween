import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './server/src/database/schema.ts',
  out: './server/drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: './server/data/readbetween.db',
  },
});
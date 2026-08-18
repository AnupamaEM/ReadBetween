import {
  integer,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';

export const documents = sqliteTable('documents', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  title: text('title').notNull(),

  sourceType: text('source_type', {
    enum: ['URL', 'TEXT'],
  }).notNull(),

  sourceUrl: text('source_url'),

  rawContent: text('raw_content').notNull(),

  status: text('status', {
    enum: ['PROCESSING', 'COMPLETED', 'FAILED'],
  })
    .notNull()
    .default('PROCESSING'),

  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),

  updatedAt: text('updated_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export const documentChunks = sqliteTable('document_chunks', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  documentId: integer('document_id')
    .notNull()
    .references(() => documents.id, {
      onDelete: 'cascade',
    }),

  chunkIndex: integer('chunk_index').notNull(),

  content: text('content').notNull(),

  // Embeddings will be stored as JSON text initially.
  embedding: text('embedding'),

  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});
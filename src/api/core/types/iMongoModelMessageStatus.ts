/**
 * Generated by orval v7.5.0 🍺
 * Do not edit manually.
 * EasyAppz API
 * API documentation for EasyAppz
 * OpenAPI spec version: 1.0.0
 */

/**
 * Статус сообщения
 */
export type IMongoModelMessageStatus = typeof IMongoModelMessageStatus[keyof typeof IMongoModelMessageStatus];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const IMongoModelMessageStatus = {
  created: 'created',
  completed: 'completed',
  processing: 'processing',
  error: 'error',
} as const;

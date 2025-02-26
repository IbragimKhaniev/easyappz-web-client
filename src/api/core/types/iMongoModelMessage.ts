/**
 * Generated by orval v7.5.0 🍺
 * Do not edit manually.
 * EasyAppz API
 * API documentation for EasyAppz
 * OpenAPI spec version: 1.0.0
 */
import type { IMongoModelMessageRole } from './iMongoModelMessageRole';
import type { IMongoModelMessageStatus } from './iMongoModelMessageStatus';

export interface IMongoModelMessage {
  /** Идентификатор сообщения */
  _id?: string;
  /** Идентификатор приложения */
  applicationz?: string;
  /** Содержимое сообщения */
  content?: string;
  /** Роль отправителя сообщения */
  role?: IMongoModelMessageRole;
  /** Статус сообщения */
  status?: IMongoModelMessageStatus;
  /** Идентификатор потока ChatGPT */
  chatgptId?: string;
  /** Предварительное содержимое сообщения */
  previewContent?: string;
}

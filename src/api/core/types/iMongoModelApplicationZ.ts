/**
 * Generated by orval v7.5.0 🍺
 * Do not edit manually.
 * EasyAppz API
 * API documentation for EasyAppz
 * OpenAPI spec version: 1.0.0
 */

export interface IMongoModelApplicationZ {
  /** Идентификатор приложения */
  _id?: string;
  /** Название приложения */
  name?: string;
  /** Описание приложения */
  description?: string;
  /** Директория приложения */
  dir?: string;
  /** Шаблон приложения */
  template?: string;
  /** Статус ожидания */
  pending?: boolean;
  /** Процент выполнения */
  pendingPercent?: number;
  /** Статус ошибки */
  error?: boolean;
  /** Сервис приложения */
  service?: string;
  /** Идентификатор потока ChatGPT */
  chatgptThreadId?: string;
  /** Время истечения потока ChatGPT */
  chatgptThreadExpiredTime?: string;
  /** Текст ошибки */
  errorText?: string;
}

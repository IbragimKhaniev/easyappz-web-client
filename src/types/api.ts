
export interface App {
  id: string;
  name?: string;
  description?: string;
}

export interface Message {
  message: string;
  app: string;
  from: string;
}

export interface CreateMessageRequest {
  message: string;
  app: string;
}

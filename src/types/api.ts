
export interface App {
  _id: string;
  name: string;
  dir: string;
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

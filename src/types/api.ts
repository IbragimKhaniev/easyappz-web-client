
export interface App {
  _id: string;
  name: string;
  dir: string;
  template: string;

  chatgptThreadId?: string;
}

export interface Message {
  _id: string;

  content: string;
  applicationz: string;
  role: 'user' | 'assistant';
}

export interface CreateMessageRequest {
  applicationzId: string;
  content: string;
  role: 'user' | 'assistant';
}

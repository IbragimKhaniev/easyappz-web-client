
import type { App, Message } from '@/types/api';

const API_BASE_URL = 'http://localhost:3000/api';

export const createApp = async (): Promise<App> => {
  const response = await fetch(`${API_BASE_URL}/apps`, {
    method: 'POST',
  });
  
  if (!response.ok) {
    throw new Error('Failed to create app');
  }
  
  return response.json();
};

export const getApp = async (appId: string): Promise<App> => {
  const response = await fetch(`${API_BASE_URL}/apps/${appId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }
  
  return response.json();
};

export const getMessages = async (appId: string): Promise<Message[]> => {
  const response = await fetch(`${API_BASE_URL}/messages/${appId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }
  
  return response.json();
};

export const sendMessage = async (message: string, appId: string): Promise<Message> => {
  const response = await fetch(`${API_BASE_URL}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      app: appId,
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to send message');
  }
  
  return response.json();
};

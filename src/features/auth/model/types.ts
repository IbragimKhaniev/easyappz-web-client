
export interface User {
  email: string;
  username: string;
  apps: Array<{
    id: number;
    name: string;
    description: string;
  }>;
}

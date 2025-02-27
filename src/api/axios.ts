import axios, {AxiosError, AxiosRequestConfig} from 'axios';

export const BASE_URL = import.meta.env.VITE_API_URL;

export const AXIOS_INSTANCE = axios.create({
  timeout: 30000,
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',  // Устанавливаем Content-Type для JSON
  },
});

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => (
  AXIOS_INSTANCE(config)
    .then(response => response.data)
    .catch((error) => {
      if (error.status === 401) {
        window.location.pathname = '/welcome';
      } else {
        throw error.response.data;
      }
    })
);

export default customInstance;
export type ErrorType<Error> = AxiosError<Error>;
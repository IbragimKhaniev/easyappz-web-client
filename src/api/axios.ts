import axios, {AxiosError, AxiosRequestConfig} from 'axios';

export const BASE_URL = import.meta.env.VITE_API_URL;

export const baseURL = BASE_URL;
export const AXIOS_INSTANCE = axios.create({
  timeout: 30000,
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',  // Устанавливаем Content-Type для JSON
  },
});

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const source = axios.CancelToken.source();
  return AXIOS_INSTANCE({...config, cancelToken: source.token}).then(response => {
    if (response.status === 400) {
      // throw new Error(JSON.stringify(response.data));
    } else if (response.status === 401) {
      window.location.pathname = '/';
      // костыль, чтобы при логине не обновляло страницу
      // TODO переделать страницу error
      // if (window.location.pathname === '/') {
      //   throw new Error(JSON.stringify(response.data));
      // } else {
      //   // window.location.pathname = `${ROUTES.ERROR}/${response.status}`;
      // }
    } else {
      return response.data;
    }
  });
};

export default customInstance;
export type ErrorType<Error> = AxiosError<Error>;
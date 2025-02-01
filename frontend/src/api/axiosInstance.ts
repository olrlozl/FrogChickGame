import axios, { AxiosError } from 'axios';
import { refreshJwtAccessToken } from './userApi';
import { ERROR_MESSAGES } from 'constants/errorMessages';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL_DEV + '/api',
});

instance.interceptors.request.use(
  (config) => {
    const jwtAccessToken = localStorage.getItem('jwtAccessToken');
    if (jwtAccessToken) {
      config.headers.Authorization = `Bearer ${jwtAccessToken}`;
    }

    if (config.data) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// 1. AxiosError인지, JavaScriptError인지, 기타 에러인지 분기
// 2. AxiosError -> 응답이 있는 오류인지, 네트워크 오류인지, 기타 에러인지 분기
// 3. 응답이 있는 오류 -> 토큰 만료인지(만료라면 토큰 갱신 요청), 토큰이 없는지 분기
export const setAxiosInterceptorResponse = (
  setErrorMessage: (errorMessage: string) => void
) => {
  instance.interceptors.response.use(
    (res) => res,
    async (err) => {
      if (err instanceof AxiosError) {
        if (err.response) {
          switch (err.response.data.errorType) {
            case 'EXPIRED_JWT_TOKEN':
              const originalRequestConfig = err.config;

              if (originalRequestConfig) {
                try {
                  const jwtAccessToken = originalRequestConfig.headers
                    .Authorization as string;
                  const { newJwtAccessToken } =
                    await refreshJwtAccessToken(jwtAccessToken);
                  localStorage.setItem('jwtAccessToken', newJwtAccessToken);
                  originalRequestConfig.headers.Authorization = `Bearer ${newJwtAccessToken}`;
                  return instance(originalRequestConfig);
                } catch (refreshJwtAccessTokenApiError) {
                  // 토큰이 만료가 안됐을 시 재요청
                  if (
                    err instanceof AxiosError &&
                    err.response.data.errorType ===
                      'JWT_ACCESS_TOKEN_NOT_EXPIRED'
                  ) {
                    return instance(originalRequestConfig);
                  } else {
                    setErrorMessage(
                      ERROR_MESSAGES.COMMON[err.response.data.errorType]
                    );
                  }
                }
              }
              break;
            case 'MISSING_JWT_ACCESS_TOKEN':
              setErrorMessage(
                ERROR_MESSAGES.COMMON[err.response.data.errorType]
              );
              break;
          }
          // 서버 다운 등의 네트워크 오류
        } else if (err.code === 'ERR_NETWORK') {
          setErrorMessage(ERROR_MESSAGES.COMMON.ERR_NETWORK);
        } else {
          setErrorMessage(ERROR_MESSAGES.COMMON.OTHER);
        }
      } else if (err instanceof Error) {
        console.log('javaScript 에러 발생', err);
        setErrorMessage(ERROR_MESSAGES.COMMON.OTHER);
      } else {
        console.log('알 수 없는 에러 발생.', err);
        setErrorMessage(ERROR_MESSAGES.COMMON.OTHER);
      }
      return Promise.reject(err);
    }
  );
};

export default instance;

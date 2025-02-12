import axios, { AxiosError } from 'axios';
import { refreshJwtAccessToken } from './userApi';
import { COMMON_MESSAGES, ERROR_MESSAGES } from 'constants/errorMessages';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL_DEV + '/api',
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    if (config.data) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// 요청 대기열과 토큰 갱신 중인지 확인하는 변수
let refreshingPromise: Promise<boolean> | null = null;
const requestQueue: (() => void)[] = [];

export const setAxiosInterceptorResponse = (
  setErrorMessage: (errorMessage: string) => void
) => {
  const interceptorId = instance.interceptors.response.use(
    (res) => res,
    async (err) => {
      if (err instanceof AxiosError) {
        if (err.response) {
          switch (err.response.data.errorType) {
            case 'EXPIRED_JWT_TOKEN': {
              const originalRequestConfig = err.config;
              if (!originalRequestConfig) return Promise.reject(err);

              // 토큰 갱신이 진행 중이라면 요청을 대기열에 추가
              if (refreshingPromise) {
                return new Promise((resolve) => {
                  requestQueue.push(() => {
                    resolve(instance(originalRequestConfig));
                  });
                });
              }

              // 토큰 갱신을 시작 (한 번만 실행)
              refreshingPromise = (async () => {
                try {
                  await refreshJwtAccessToken();
                  // 대기 중인 요청을 한꺼번에 실행
                  requestQueue.forEach((callback) => callback());
                  requestQueue.length = 0; // 큐 초기화
                  return true;
                } catch (refreshJwtAccessTokenApiError) {
                  if (
                    refreshJwtAccessTokenApiError instanceof AxiosError &&
                    refreshJwtAccessTokenApiError.response &&
                    refreshJwtAccessTokenApiError.response.data.errorType ===
                      'JWT_ACCESS_TOKEN_NOT_EXPIRED'
                  ) {
                    return true;
                  } else {
                    setErrorMessage(
                      COMMON_MESSAGES.RE_LOGIN
                    );
                    return false;
                  }
                } finally {
                  refreshingPromise = null; // 갱신 완료 후 null로 초기화
                }
              })();

              // 새로운 토큰을 받아서 요청을 재시도
              return refreshingPromise.then((success) => {
                if (success) {
                  return instance(originalRequestConfig);
                }
                return Promise.reject(err);
              });
            }
            case 'MISSING_JWT_ACCESS_TOKEN':
              setErrorMessage(COMMON_MESSAGES.RE_LOGIN);
              break;
          }
        } else if (err.code === 'ERR_NETWORK') {
          setErrorMessage(ERROR_MESSAGES.COMMON.ERR_NETWORK);
        } else {
          setErrorMessage(ERROR_MESSAGES.COMMON.OTHER);
        }
      } else if (err instanceof Error) {
        console.log('JavaScript 에러 발생', err);
        setErrorMessage(ERROR_MESSAGES.COMMON.OTHER);
      } else {
        console.log('알 수 없는 에러 발생.', err);
        setErrorMessage(ERROR_MESSAGES.COMMON.OTHER);
      }
      return Promise.reject(err);
    }
  );
  return interceptorId;
};

export default instance;

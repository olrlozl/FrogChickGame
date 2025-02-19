import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ERROR_MESSAGES } from 'constants/errorMessages';
import { useErrorStore } from 'stores/errorStore';

const MAX_RETRIES = 3;

const { setErrorMessage } = useErrorStore.getState();

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, err) => {
        const canRetry = failureCount < MAX_RETRIES;

        // 네트워크 오류, 서버 오류인 경우 재시도
        if (err instanceof AxiosError) {
          if (
            err.code === 'ERR_NETWORK' ||
            (err.response?.status && err.response?.status >= 500)
          )
            return canRetry;
        }

        // 그 외는 재시도 안함
        return false;
      },
    },
  },
  mutationCache: new MutationCache({
    onError: (err) => {
      if (err instanceof AxiosError && err.code === 'ERR_NETWORK') {
        setErrorMessage(ERROR_MESSAGES.COMMON.ERR_NETWORK);
      }
    },
  }),
  queryCache: new QueryCache({
    onError: (err) => {
      if (err instanceof AxiosError && err.code === 'ERR_NETWORK') {
        setErrorMessage(ERROR_MESSAGES.COMMON.ERR_NETWORK);
      }
    },
  }),
});

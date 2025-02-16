import { MutationCache, QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ERROR_MESSAGES } from 'constants/errorMessages';
import { useErrorStore } from 'stores/errorStore';

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (err) => {
      const { setErrorMessage } = useErrorStore.getState();
      if (err instanceof AxiosError && err.code === 'ERR_NETWORK') {
        setErrorMessage(ERROR_MESSAGES.COMMON.ERR_NETWORK);
      }
    },
  }),
});

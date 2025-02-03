import { queryClient } from 'api/queryClient';
import { useErrorStore } from 'stores/errorStore';
import { usePlayStore } from 'stores/playStore';

export const useClear = () => {
  const { clearErrorMessage } = useErrorStore();

  const { clearCharacterState } = usePlayStore();

  const clearAndNavigateToLanding = () => {
    localStorage.clear();
    queryClient.clear();
    clearErrorMessage();
    clearCharacterState();
    window.location.href = '/';
  };

  return clearAndNavigateToLanding;
};

import { queryClient } from 'api/queryClient';
import { useNavigate } from 'react-router-dom';
import { useErrorStore } from 'stores/errorStore';
import { usePlayStore } from 'stores/playStore';
import { useUserStore } from 'stores/userStore';

export const useClear = () => {
  const { clearErrorMessage } = useErrorStore();

  const { clearCharacterState } = usePlayStore();

  const { logout } = useUserStore();

  const navigate = useNavigate();

  const clearAndNavigateToLanding = () => {
    queryClient.clear();
    clearErrorMessage();
    clearCharacterState();
    logout();
    navigate('/')
  };

  return clearAndNavigateToLanding;
};

import { useMutation } from '@tanstack/react-query';
import { kakaoLogout } from 'api/userApi';
import { MUTATION_KEYS } from 'constants/reactQueryKeys';
import { useClear } from 'hooks/common/useClear';
import { useErrorStore } from 'stores/errorStore';
import { errorHandle } from 'utils/error';

export const useLogout = (closeModal: () => void) => {
  const { setErrorMessage } = useErrorStore();

  const clearAndNavigateToLanding = useClear();

  const { mutate: executeKakaoLogout, isPending: isLogoutLoading } = useMutation({
    mutationFn: kakaoLogout,
    mutationKey: [MUTATION_KEYS.logout],
    onSuccess: () => {
      clearAndNavigateToLanding();
    },
    onError: (e) => {
      errorHandle(e, setErrorMessage, 'KAKAO_LOGOUT');
    },
    onSettled: () => {
      closeModal();
    },
  });

  return { executeKakaoLogout, isLogoutLoading };
};

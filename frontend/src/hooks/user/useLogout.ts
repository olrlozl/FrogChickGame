import { useMutation } from '@tanstack/react-query';
import { kakaoLogout } from 'api/userApi';
import { useErrorStore } from 'stores/errorStore';
import { clearAndRedirectToLanding } from 'utils/auth';
import { errorHandle } from 'utils/error';

export const useLogout = (closeModal: () => void) => {
  const { setErrorMessage } = useErrorStore();

  const { mutate: executeKakaoLogout } = useMutation({
    mutationFn: kakaoLogout,
    mutationKey: ['logout'],
    onSuccess: () => {
      clearAndRedirectToLanding();
    },
    onError: (e) => {
      errorHandle(e, setErrorMessage, 'KAKAO_LOGOUT');
    },
    onSettled: () => {
      closeModal();
    },
  });

  return executeKakaoLogout
}
import { useMutation } from '@tanstack/react-query';
import { kakaoLogin } from 'api/userApi';
import { MUTATION_KEYS } from 'constants/reactQueryKeys';
import { useNavigate } from 'react-router-dom';
import { useErrorStore } from 'stores/errorStore';
import { useUserStore } from 'stores/userStore';
import { SetState } from 'types/common';
import { errorHandle } from 'utils/error';

export const useLogin = (
  setUserId: SetState<string>,
  openModal: () => void
) => {
  const { setErrorMessage } = useErrorStore();

  const { login } = useUserStore();

  const navigate = useNavigate();

  const { mutate: executeKakaoLogin } = useMutation({
    mutationFn: kakaoLogin,
    mutationKey: [MUTATION_KEYS.login],
    onSuccess: (data) => {
      // 닉네임 있는 유저
      if (data === '') {
        login();
        navigate('/main');

        // 닉네임 없는 유저
      } else {
        setUserId(data.userId);
        openModal();
      }
    },
    onError: (e) => {
      errorHandle(e, setErrorMessage, 'KAKAO_LOGIN');
    },
  });

  return executeKakaoLogin;
};

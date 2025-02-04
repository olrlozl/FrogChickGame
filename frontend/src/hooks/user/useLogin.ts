import { useMutation } from '@tanstack/react-query';
import { kakaoLogin } from 'api/userApi';
import { MUTATION_KEYS, QUERY_KEYS } from 'constants/reactQueryKeys';
import { useNavigate } from 'react-router-dom';
import { useErrorStore } from 'stores/errorStore';
import { SetState } from 'types/common';
import { errorHandle } from 'utils/error';

export const useLogin = (
  setKakaoAccessToken: SetState<string>,
  openModal: () => void
) => {
  const { setErrorMessage } = useErrorStore();

  const navigate = useNavigate();

  const { mutate: executeKakaoLogin } = useMutation({
    mutationFn: kakaoLogin,
    mutationKey: [MUTATION_KEYS.login],
    onSuccess: (tokens) => {
      // 이미 가입한 유저
      if (tokens.jwtAccessToken) {
        localStorage.setItem('jwtAccessToken', tokens.jwtAccessToken);
        navigate('/main');

        // 미가입 유저
      } else if (tokens.kakaoAccessToken) {
        setKakaoAccessToken(tokens.kakaoAccessToken);
        openModal();
      }
    },
    onError: (e) => {
      errorHandle(e, setErrorMessage, 'KAKAO_LOGIN');
    },
  });

  return executeKakaoLogin;
};

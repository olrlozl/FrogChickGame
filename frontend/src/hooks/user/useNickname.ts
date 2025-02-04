import { useMutation } from '@tanstack/react-query';
import { createUser } from 'api/userApi';
import { AxiosError } from 'axios';
import { ERROR_MESSAGES } from 'constants/errorMessages';
import { useNavigate } from 'react-router-dom';
import { SetState } from 'types/common';
import { errorHandle } from 'utils/error';
import { validateNickname } from 'utils/validate';

export const useNickname = (
  nickname: string,
  kakaoAccessToken: string,
  setNicknameErrorMessage: SetState<string>
) => {
  const navigate = useNavigate();
  const { mutate } = useMutation({
    mutationFn: createUser,
    onSuccess: ({ jwtAccessToken }) => {
      localStorage.setItem('jwtAccessToken', jwtAccessToken);
      navigate('/main');
    },
    onError: (e) => {
      errorHandle(e, setNicknameErrorMessage, 'CREATE_USER');
    },
  });

  const validateAndCreateUser = () => {
    if (!nickname) {
      setNicknameErrorMessage(ERROR_MESSAGES.CREATE_USER.MISSING_NICKNAME);
      return;
    }

    const isValidNickname = validateNickname(nickname);
    if (!isValidNickname) {
      setNicknameErrorMessage(ERROR_MESSAGES.CREATE_USER.IVALID_NICKNAME);
      return;
    }

    mutate({ nickname, kakaoAccessToken });
  };

  return validateAndCreateUser;
};

import { useMutation } from '@tanstack/react-query';
import { createNickname } from 'api/userApi';
import { AxiosError } from 'axios';
import { COMMON_MESSAGES, ERROR_MESSAGES } from 'constants/errorMessages';
import { useNavigate } from 'react-router-dom';
import { useErrorStore } from 'stores/errorStore';
import { useUserStore } from 'stores/userStore';
import { SetState } from 'types/common';
import { errorHandle } from 'utils/error';
import { validateNickname } from 'utils/validate';

export const useNickname = (
  userId: string,
  nickname: string,
  setNicknameErrorMessage: SetState<string>,
  closeModal: () => void
) => {
  const navigate = useNavigate();
  const { setErrorMessage } = useErrorStore();

  const { login } = useUserStore();

  const { mutate, isPending: isCreateNicknameLoading } = useMutation({
    mutationFn: createNickname,
    onSuccess: () => {
      login();
      navigate('/main');
    },
    onError: (e) => {
      if (e instanceof AxiosError && e.response?.data.errorType) {
        switch (e.response?.data.errorType) {
          // 재로그인이 필요한 errorType의 경우 에러 모달을 띄우기 위해
          case 'MISSING_USERID':
          case 'INVALID_USERID':
          case 'NOT_FOUND_USER':
            closeModal(); // 닉네임 생성 모달 닫기
            setErrorMessage(COMMON_MESSAGES.RE_LOGIN);
            break;
          // 이미 닉네임이 있는 유저인 경우 메인으로 이동 후 닉네임 이미 있다는 모달 띄우기
          case 'ALREADY_EXISTS_NICKNAME':
            navigate('/main');
            setErrorMessage(
              ERROR_MESSAGES.CREATE_NICKNAME.ALREADY_EXISTS_NICKNAME
            );
            break;
          // 그 외의 errorType은 닉네임 input 밑에 에러메세지 표시
          default:
            errorHandle(e, setNicknameErrorMessage, 'CREATE_NICKNAME');
        }
      }
    },
  });

  const validateAndCreateNickname = () => {
    console.log('gd')
    if (!nickname) {
      setNicknameErrorMessage(ERROR_MESSAGES.CREATE_NICKNAME.MISSING_NICKNAME);
      return;
    }

    const isValidNickname = validateNickname(nickname);
    if (!isValidNickname) {
      setNicknameErrorMessage(ERROR_MESSAGES.CREATE_NICKNAME.IVALID_NICKNAME);
      return;
    }

    mutate({ userId, nickname });
  };

  return { validateAndCreateNickname, isCreateNicknameLoading };
};

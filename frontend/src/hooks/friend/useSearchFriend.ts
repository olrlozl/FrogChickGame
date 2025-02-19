import { useQuery } from '@tanstack/react-query';
import { searchFriend } from 'api/friendApi';
import { AxiosError } from 'axios';
import { COMMON_MESSAGES, ERROR_MESSAGES } from 'constants/errorMessages';
import { QUERY_KEYS } from 'constants/reactQueryKeys';
import { useEffect, useState } from 'react';
import { useErrorStore } from 'stores/errorStore';
import { SetState } from 'types/common';
import { errorHandle } from 'utils/error';
import { validateNickname } from 'utils/validate';

const MAX_RETRIES = 3;

export const useSearchFriend = (
  nickname: string,
  setNicknameErrorMessage: SetState<string>
) => {
  const { setErrorMessage } = useErrorStore();
  const [searchedNickname, setSearchedNickname] = useState('');

  const validateAndSearchFriend = () => {
    if (!nickname) {
      setNicknameErrorMessage(ERROR_MESSAGES.SEARCH_FRIEND.MISSING_NICKNAME);
      return;
    }

    const isValidNickname = validateNickname(nickname);

    if (!isValidNickname) {
      setNicknameErrorMessage(ERROR_MESSAGES.SEARCH_FRIEND.INVALID_NICKNAME);
      return;
    }

    setSearchedNickname(nickname);
  };

  const {
    data: userInfo,
    isLoading: searchFriendLoading,
    isError: isSearchFriendError,
    error: searchFriendError,
  } = useQuery({
    queryKey: [QUERY_KEYS.friends, searchedNickname],
    queryFn: () => searchFriend({ nickname: searchedNickname }),
    enabled: !!searchedNickname,
    staleTime: 1000 * 60 * 30,
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
  });

  useEffect(
    function clearUserInfoUI() {
      setSearchedNickname('');
    },
    [nickname]
  );

  useEffect(
    function setSearchFriendErrorMessage() {
      if (!isSearchFriendError || !(searchFriendError instanceof AxiosError)) {
        return;
      }
      const errorType = searchFriendError.response?.data.errorType;

      if (errorType === 'INVALID_USERID') {
        setErrorMessage(COMMON_MESSAGES.RE_LOGIN);
      } else {
        errorHandle(
          searchFriendError,
          setNicknameErrorMessage,
          'SEARCH_FRIEND'
        );
      }
    },
    [isSearchFriendError, searchFriendError]
  );

  return {
    userInfo,
    validateAndSearchFriend,
    searchFriendLoading,
  };
};

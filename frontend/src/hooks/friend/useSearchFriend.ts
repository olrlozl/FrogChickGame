import { useMutation, useQuery } from '@tanstack/react-query';
import { applyFriend, searchFriend } from 'api/friendApi';
import { queryClient } from 'api/queryClient';
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

  const { mutate: executeApplyFriend, isPending: isApplyFriendLoading } =
    useMutation({
      mutationFn: applyFriend,
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.friends, variables.to],
        });
      },
      onError: (err) => {
        if (err instanceof AxiosError && err.response?.data.errorType) {
          switch (err.response?.data.errorType) {
            case 'INVALID_USERID':
              setErrorMessage(COMMON_MESSAGES.RE_LOGIN);
              break;

            // 이미 신청하거나, 친구인 경우 UI 갱신을 위해 쿼리 무효화
            case 'ALREADY_FRIEND':
            case 'ALREADY_APPLY_FRIEND':
              if ('to' in err.config?.data) {
                queryClient.invalidateQueries({
                  queryKey: [QUERY_KEYS.friends, err.config?.data.to],
                });
              }
              break;

            // 존재하지 않는 사용자일 경우 캐시에서 삭제 후 에러메시지 표시
            case 'UNKNOWN_USER':
              if ('to' in err.config?.data) {
                queryClient.removeQueries({
                  queryKey: [QUERY_KEYS.friends, err.config?.data.to],
                });
              }
              setNicknameErrorMessage(ERROR_MESSAGES.APPLY_FRIEND.UNKNOWN_USER);
              break;
            default:
              errorHandle(err, setNicknameErrorMessage, 'APPLY_FRIEND');
          }
        }
      },
    });

  return {
    userInfo,
    validateAndSearchFriend,
    searchFriendLoading,
    executeApplyFriend,
    isApplyFriendLoading,
  };
};

import 'styles/components/user/friend-request-section.scss';
import BalloonTitle from 'components/user/BalloonTitle';
import MiniButton from 'components/common/Button/MiniButton';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from 'constants/reactQueryKeys';
import { getReceivedFriendList } from 'api/friendApi';
import { useEffect, useState } from 'react';
import { LocalLoadingSpinner } from 'components/common/LocalLoadingSpinner';
import { AxiosError } from 'axios';
import { COMMON_MESSAGES } from 'constants/errorMessages';
import { useErrorStore } from 'stores/errorStore';
import { errorHandle } from 'utils/error';
import { ErrorMessage } from 'components/common/Modal/ErrorMessage';
import { queryClient } from 'api/queryClient';

const FriendRequestSection = () => {
  const [requestErrorMessage, setRequestErrorMessage] = useState('');

  const { setErrorMessage } = useErrorStore();

  const { data, refetch, isFetching, isError, error } = useQuery({
    queryKey: [QUERY_KEYS.friends, 'receipts'],
    queryFn: getReceivedFriendList,
  });

  useEffect(() => {
    if (!isError || !(error instanceof AxiosError)) {
      return;
    }
    const errorType = error.response?.data.errorType;

    if (errorType === 'INVALID_USERID') {
      setErrorMessage(COMMON_MESSAGES.RE_LOGIN);
      // 에러 발생 시 캐싱된 데이터를 삭제하고, 에러메세지 출력
    } else {
      queryClient.removeQueries({ queryKey: [QUERY_KEYS.friends, 'receipts'] });
      errorHandle(error, setRequestErrorMessage, 'GET_FRIEND_RECEIPTS');
    }
  }, [isError, error]);

  return (
    <div className="friend-request-section">
      <BalloonTitle title="받은 요청" showRefresh={true} onClick={refetch} />
      <div className="request-box">
        {isFetching && <LocalLoadingSpinner />}
        {!isFetching &&
          data &&
          data.receivedList.map((friend, idx) => (
            <div className="request-item" key={idx}>
              <span className="nickname">{friend.nickname}</span>
              <div className="button-box">
                <MiniButton type="accept" />
                <MiniButton type="reject" />
              </div>
            </div>
          ))}
        {isError && <ErrorMessage errorMessage={requestErrorMessage} />}
      </div>
    </div>
  );
};

export default FriendRequestSection;

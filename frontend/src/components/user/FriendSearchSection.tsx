import MiniButton from 'components/common/Button/MiniButton';
import 'styles/components/user/friend-search-section.scss';
import NicknameInput from 'components/user/NicknameInput';
import BalloonTitle from 'components/user/BalloonTitle';
import UserInfo from 'components/user/UserInfo';
import { useState } from 'react';
import { ErrorMessage } from 'components/common/Modal/ErrorMessage';
import { SearchFriendResponse } from 'types/friend';
import { useSearchFriend } from 'hooks/friend/useSearchFriend';

const FriendSearchSection = () => {
  const [nickname, setNickname] = useState('');
  const [nicknameErrorMessage, setNicknameErrorMessage] = useState('');

  const {
    userInfo,
    searchFriendLoading,
    validateAndSearchFriend,
    executeApplyFriend,
    isApplyFriendLoading,
  } = useSearchFriend(nickname, setNicknameErrorMessage);

  const getMiniButtonType = (userInfo: SearchFriendResponse) => {
    if (userInfo.isFriend) return 'friend';
    if (userInfo.isSent) return 'pending';
    return 'add';
  };

  const getMiniButtonOnClick = (userInfo: SearchFriendResponse) => {
    if (userInfo.isFriend) return;

    if (userInfo.isSent) return () => {};
    else
      return () => {
        executeApplyFriend({ to: userInfo.nickname });
      };
  };

  return (
    <div className="friend-search-section">
      <BalloonTitle title="친구 검색" />
      <div className="friend-search-box">
        <NicknameInput
          text="닉네임을 입력해주세요."
          nickname={nickname}
          setNickname={setNickname}
          setErrorMessage={setNicknameErrorMessage}
        />
        <MiniButton
          type="search"
          onClick={validateAndSearchFriend}
          isLoading={searchFriendLoading}
        />
      </div>
      <div className="result-box">
        {userInfo && (
          <>
            <UserInfo userInfoOption="search" userInfo={userInfo} />
            <MiniButton
              type={getMiniButtonType(userInfo)}
              onClick={getMiniButtonOnClick(userInfo)}
              isLoading={isApplyFriendLoading}
            />
          </>
        )}
        {nicknameErrorMessage && (
          <ErrorMessage errorMessage={nicknameErrorMessage} />
        )}
      </div>
    </div>
  );
};

export default FriendSearchSection;

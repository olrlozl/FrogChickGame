import 'styles/components/user/friend-list-section.scss';
import BalloonTitle from 'components/user/BalloonTitle';
import UserInfo from 'components/user/UserInfo';
import MiniButton from 'components/common/Button/MiniButton';
import UserState from 'components/user/UserState';
import { UserInfoInterface } from 'types/user';
import { FriendStatus } from 'types/friend';

interface Friend {
  userInfo: UserInfoInterface;
  status: FriendStatus;
}

const FriendListSection = () => {
  const users: Friend[] = [
    {
      userInfo: { nickname: '은지여섯글자', wins: 10, losses: 3 },
      status: 'online',
    },
    { userInfo: { nickname: '현수', wins: 5, losses: 1 }, status: 'playing' },
    { userInfo: { nickname: '에찌얌', wins: 4, losses: 1 }, status: 'offline' },
  ];

  return (
    <div className="friend-list-section">
      <BalloonTitle title="친구 목록"  showRefresh={true} onClick={()=>{}}/>
      <div className="list-box">
        {users.map((user) => {
          return (
            <div className="user-item">
              <UserInfo
                userInfoOption="list"
                userInfo={user.userInfo}
              />
              {user.status === 'online' ? (
                <MiniButton type="game" />
              ) : (
                <UserState state={user.status} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FriendListSection;

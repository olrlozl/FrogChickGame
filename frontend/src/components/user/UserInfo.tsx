import 'styles/components/user/user-info.scss';
import WinLoseBox from './WinLoseBox';
import { UserInfoInterface } from 'types/user';

interface UserInfoProps {
  userInfoOption: 'search' | 'list';
  userInfo: UserInfoInterface;
}

const UserInfo = ({ userInfoOption, userInfo }: UserInfoProps) => {
  const { nickname, wins, losses } = userInfo;
  const color = userInfoOption === 'search' ? 'main-green' : 'main-yellow';
  return (
    <div className="user-info">
      <span className={`nickname ${userInfoOption}`}>{nickname}</span>
      <WinLoseBox wins={wins} losses={losses} color={color} size="font-md" />
    </div>
  );
};

export default UserInfo;

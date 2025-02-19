import 'styles/components/user/friend-request-section.scss';
import BalloonTitle from 'components/user/BalloonTitle';
import MiniButton from 'components/common/Button/MiniButton';

const FriendRequestSection = () => {
  return (
    <div className='friend-request-section'>
      <BalloonTitle title='받은 요청' />
      <div className='request-box'>
        <span className='nickname'>은지여섯글자</span>
        <div className='button-box'>
          <MiniButton type='accept'/>
          <MiniButton type='reject'/>
        </div>
      </div>
    </div>
  )
}

export default FriendRequestSection
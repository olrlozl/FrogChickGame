import kakao from 'assets/images/kakao.png';
import 'styles/components/account/kakao-button.scss';

const KakaoButton = ({ onClick, kakaoOption }: {
  onClick: () => void;
  kakaoOption: '로그인' | '로그아웃'
}) => {
  return (
    <div className="kakao-button" onClick={onClick}>
      <div className="content-box">
        <img src={kakao} alt="카카오" />
        <span>{kakaoOption}</span>
      </div>
    </div>
  );
};

export default KakaoButton;

import logo from 'assets/images/logo.png';
import board from 'assets/images/board.png';
import 'styles/components/common/Button/long-button.scss';
import 'styles/pages/landing-page.scss';
import { useEffect, useState } from 'react';
import Modal from 'components/common/Modal/Modal';
import { useNickname } from 'hooks/user/useNickname';
import { useModal } from 'hooks/common/useModal';
import { modalProps } from 'constants/modal';
import KakaoButton from 'components/user/KakaoButton';
import { useLogin } from 'hooks/user/useLogin';

const LandingPage = () => {
  const { isModalOpen, openModal } = useModal();
  const [userId, setUserId] = useState('');
  const [nicknameErrorMessage, setNicknameErrorMessage] = useState('');
  const [nickname, setNickname] = useState('');
  const { message, btns } = modalProps.createNickname;

  // 1. 카카오 버튼 처음 눌렀을 때
  const code = new URL(window.location.href).searchParams.get('code');
  const handleClickGetKakaoCode = () => {
    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_REST_API_KEY}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=code`;
  };

  // 2. 리다이렉션 후 카카오 로그인 시도
  const executeKakaoLogin = useLogin(setUserId, openModal);
  useEffect(() => {
    if (code) {
      const redirectUri = process.env.REACT_APP_REDIRECT_URI as string;
      executeKakaoLogin({ redirectUri, code });
    }
  }, [code, executeKakaoLogin]);

  // 3. 미가입 유저라면 닉네임 생성
  const validateAndCreateNickname = useNickname(
    userId,
    nickname,
    setNicknameErrorMessage
  );

  return (
    <div className="landing-page">
      <img className="logo" src={logo} alt="로고" />
      <img className="board" src={board} alt="게임판" />
      <KakaoButton onClick={handleClickGetKakaoCode} kakaoOption="로그인" />
      <Modal
        isOpen={isModalOpen}
        message={message}
        btns={btns}
        buttonActions={[validateAndCreateNickname]}
      >
        <Modal.NicknameInput
          text="한글, 영어 2~6자"
          nickname={nickname}
          setNickname={setNickname}
          setErrorMessage={setNicknameErrorMessage}
        />
        <Modal.ErrorMessage errorMessage={nicknameErrorMessage} />
      </Modal>
    </div>
  );
};

export default LandingPage;

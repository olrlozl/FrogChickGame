import GuideBalloon from 'components/guide/GuideBalloon';
import 'styles/pages/guide-page.scss';
import farmer from 'assets/images/farmer.png';
import pond from 'assets/images/pond.png';
import { useState } from 'react';
import KakaoButton from 'components/user/KakaoButton';
import Modal from 'components/common/Modal/Modal';
import { modalProps } from 'constants/modal';
import { useModal } from 'hooks/common/useModal';
import { GuideOption } from 'types/guide';
import { useLogout } from 'hooks/user/useLogout';

const GuidePage = () => {
  const [selectedOption, setSelectedOption] = useState<GuideOption>('rule');
  const { isModalOpen, openModal, closeModal } = useModal();
  const { message, messageFontSize, btns } = modalProps.logoutConfirm;

  const guideImage = selectedOption === 'rule' ? pond : farmer;

  const handleClickChangeOption = (nextOption: GuideOption) => {
    if (nextOption !== selectedOption)
      setSelectedOption((prev) => (prev === 'rule' ? 'control' : 'rule'));
  };

  const executeKakaoLogout = useLogout(closeModal);

  return (
    <div className="guide-page">
      <GuideBalloon
        guideOption={selectedOption}
        onClick={handleClickChangeOption}
      />
      <img src={guideImage} alt="구리와 농부" />
      <KakaoButton onClick={openModal} kakaoOption="로그아웃" />
      <Modal
        isOpen={isModalOpen}
        message={message}
        messageFontSize={messageFontSize}
        btns={[
          {
            label: btns[0].label,
            onClick: executeKakaoLogout,
            type: btns[0].type,
          },
          {
            label: btns[1].label,
            onClick: closeModal,
            type: btns[1].type,
          },
        ]}
      />
    </div>
  );
};

export default GuidePage;

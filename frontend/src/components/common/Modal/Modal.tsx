import ReactDOM from 'react-dom';
import ModalButton from 'components/common/Button/ModalButton';
import 'styles/components/common/Modal/modal.scss';
import NicknameInput from 'components/user/NicknameInput';
import OverLay from 'components/common/Modal/OverLay';
import { ButtonType, MessageFontSize, SetState } from 'types/common';

interface ModalProps {
  isOpen: boolean;
  imageSrc?: string;
  message: string;
  messageFontSize?: MessageFontSize;
  hasNicknameInput?: boolean;
  nickname?: string;
  setNickname?: SetState<string>;
  errorMessage?: string;
  setErrorMessage? : SetState<string>;
  btns: { label: string; onClick: () => void; type: ButtonType }[];
}

const Modal = ({
  isOpen,
  imageSrc,
  message,
  messageFontSize,
  hasNicknameInput = false,
  nickname,
  setNickname,
  errorMessage,
  setErrorMessage,
  btns,
}: ModalProps) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal">
      <OverLay />
      <div className="container" onClick={(e) => e.stopPropagation()}>
        {imageSrc && (
          <img className="image" src={imageSrc} alt="Modal Visual" />
        )}
        <div className={`message ${messageFontSize}`}>{message}</div>
        {hasNicknameInput && nickname != undefined && setNickname && setErrorMessage && (
          <div className="nickname-input">
            <NicknameInput text="한글, 영어 2~6자" nickname={nickname} setNickname={setNickname} setErrorMessage={setErrorMessage}/>
            <div className="error-message">{errorMessage}</div>
          </div>
        )}
        <div className="buttons">
          {btns.map((btn, index) => (
            <ModalButton
              key={index}
              label={btn.label}
              onClick={btn.onClick}
              type={btn.type}
            ></ModalButton>
          ))}
        </div>
      </div>
    </div>,
    document.getElementById('modal-root') as HTMLElement
  );
};

export default Modal;

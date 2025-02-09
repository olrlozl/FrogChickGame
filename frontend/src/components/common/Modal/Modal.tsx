import ReactDOM from 'react-dom';
import ModalButton from 'components/common/Button/ModalButton';
import 'styles/components/common/Modal/modal.scss';
import OverLay from 'components/common/Modal/OverLay';
import { ButtonType, MessageFontSize } from 'types/common';
import { ReactNode } from 'react';
import NicknameInput from 'components/user/NicknameInput';
import { ErrorMessage } from './ErrorMessage';
import { ModalImage } from './ModalImage';

interface ModalProps {
  isOpen: boolean;
  message: string;
  messageFontSize?: MessageFontSize;
  btns: { label: string; type: ButtonType }[];
  buttonActions: (() => void)[];
  children?: ReactNode;
}

const Modal = ({
  isOpen,
  message,
  messageFontSize = 'font-md',
  btns,
  buttonActions,
  children,
}: ModalProps) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal">
      <OverLay />
      <div className="container" onClick={(e) => e.stopPropagation()}>
        <div className={`message ${messageFontSize}`}>{message}</div>
        {children}
        <div className="buttons">
          {btns.map((btn, index) => (
            <ModalButton
              key={index}
              label={btn.label}
              onClick={buttonActions[index]}
              type={btn.type}
            />
          ))}
        </div>
      </div>
    </div>,
    document.getElementById('modal-root') as HTMLElement
  );
};

export default Modal;

Modal.NicknameInput = NicknameInput;
Modal.ErrorMessage = ErrorMessage;
Modal.Image = ModalImage;

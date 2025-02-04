import { ButtonType, MessageFontSize } from 'types/common';

interface ModalProps {
  message: string;
  messageFontSize?: MessageFontSize;
  btns: { label: string; type: ButtonType }[];
}

type ModalKeys = 'logoutConfirm' | 'createNickname' | 'gameResult' | 'error';

type ModalPropsType = {
  [K in ModalKeys]: ModalProps;
};

export const modalProps: ModalPropsType = {
  logoutConfirm: {
    message: '로그아웃 하시겠습니까?',
    btns: [
      { label: '확인', type: 'primary' },
      { label: '취소', type: 'secondary' },
    ],
  },
  createNickname: {
    message: '닉네임을 입력해주세요.',
    btns: [{ label: '생성', type: 'primary' }],
  },
  gameResult: {
    message: '',
    messageFontSize: 'font-xl',
    btns: [
      { label: '재대결', type: 'primary' },
      { label: '나가기', type: 'secondary' },
    ],
  },
  error: {
    message: '',
    btns: [{ label: '확인', type: 'primary' }],
  },
};

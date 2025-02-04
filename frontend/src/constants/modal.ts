import { ButtonType, MessageFontSize } from 'types/common';

interface ModalProps {
  message: string;
  messageFontSize: MessageFontSize;
  btns: { label: string; type: ButtonType }[];
}

type ModalKeys = 'logoutConfirm' | 'createNickname' | 'error';

type ModalPropsType = {
  [K in ModalKeys]: ModalProps;
};

export const modalProps: ModalPropsType = {
  logoutConfirm: {
    message: '정말 로그아웃 하시겠습니까?',
    messageFontSize: 'font-md',
    btns: [
      { label: '확인', type: 'primary' },
      { label: '취소', type: 'secondary' },
    ],
  },
  createNickname: {
    message: '닉네임을 입력해주세요.',
    messageFontSize: 'font-md',
    btns: [{ label: '생성', type: 'primary' }],
  },
  error: {
    message: '',
    messageFontSize: 'font-md',
    btns: [{ label: '확인', type: 'primary' }],
  },
};


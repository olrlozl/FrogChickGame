import 'styles/components/common/Button/mini-button.scss';

interface MiniButtonProps {
  type: 'search' | 'add' | 'game' | 'accept' | 'reject' | 'friend' | 'pending';
  isLoading?: boolean;
  onClick?: () => void;
}

const MINI_BUTTON_CONTENTS = {
  search: { text: '검색' },
  add: { text: '친구 추가' },
  game: { text: '대결 신청' },
  accept: { text: '수락' },
  reject: { text: '거절' },
  pending: { text: '친추 취소' },
  friend: { text: '이미 친구' },
};

const MiniButton = ({ type, onClick, isLoading }: MiniButtonProps) => {
  const { text } = MINI_BUTTON_CONTENTS[type];

  return (
    <button
      className={`mini-button ${type} ${isLoading ? 'disabled' : undefined}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default MiniButton;

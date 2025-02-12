import 'styles/components/common/Button/modal-button.scss';

interface ModalButtonProps {
  label: string;
  onClick: () => void;
  type: 'primary' | 'secondary' | 'cancel';
  isLoading?: boolean;
}

const ModalButton = ({
  label,
  onClick,
  type,
  isLoading = false,
}: ModalButtonProps) => {
  return (
    <button
      className={`modal-button ${type} ${isLoading ? 'disabled' : undefined}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default ModalButton;

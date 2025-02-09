import 'styles/components/common/Modal/modal.scss';

export const ModalImage = ({ imageSrc }: { imageSrc: string }) => {
  return <img className="modal-image" src={imageSrc} alt="Modal Visual" />;
};


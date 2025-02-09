import 'styles/components/common/Modal/modal.scss';

export const ErrorMessage = ({ errorMessage }: { errorMessage: string }) => {
  return <div className="error-message">{errorMessage}</div>;
};

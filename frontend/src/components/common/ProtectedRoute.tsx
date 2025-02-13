import { COMMON_MESSAGES } from 'constants/errorMessages';
import { useClear } from 'hooks/common/useClear';
import { Navigate, Outlet } from 'react-router-dom';
import { useErrorStore } from 'stores/errorStore';
import { useUserStore } from 'stores/userStore';
import Modal from './Modal/Modal';
import { modalProps } from 'constants/modal';

export const ProtectedRoute = () => {
  const { isLogin } = useUserStore();
  const { errorMessage, clearErrorMessage } = useErrorStore();
  const clearAndNavigateToLanding = useClear();

  const handleClickModalAction =
    errorMessage === COMMON_MESSAGES.RE_LOGIN
      ? clearAndNavigateToLanding
      : clearErrorMessage;

  const { btns } = modalProps.error;

  if (isLogin)
    return (
      <>
        <Outlet />
        <Modal
          isOpen={!!errorMessage}
          message={errorMessage}
          btns={btns}
          buttonActions={[handleClickModalAction]}
        />
      </>
    );
  else return <Navigate to="/" />;
};

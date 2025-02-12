import { Navigate, Outlet } from 'react-router-dom';
import { useErrorStore } from 'stores/errorStore';
import { useUserStore } from 'stores/userStore';
import Modal from './Modal/Modal';
import { modalProps } from 'constants/modal';

export const PublicRoute = () => {
  const { isLogin } = useUserStore();
  const { errorMessage, clearErrorMessage } = useErrorStore();

  const { btns } = modalProps.error;
  if (!isLogin)
    return (
      <>
        <Outlet />
        <Modal
          isOpen={!!errorMessage}
          message={errorMessage}
          btns={btns}
          buttonActions={[clearErrorMessage]}
        />
      </>
    );
  else return <Navigate to="/main" />;
};

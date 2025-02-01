import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import OverLay from './Modal/OverLay';
import loading from 'assets/images/loading.gif';
import { MUTATIONS_KEYS } from 'constants/queryKeys';
import 'styles/components/common/loading-spinner.scss';

const LoadingSpinner = () => {
  const isFetching = useIsFetching();
  const isLoginMutating = useIsMutating({
    mutationKey: [MUTATIONS_KEYS.login],
  });
  const isLogoutMutating = useIsMutating({
    mutationKey: [MUTATIONS_KEYS.logout],
  });
  const isLoading = !!(isFetching || isLoginMutating || isLogoutMutating);

  return (
    <div className={`loading-spinner ${isLoading ? undefined : 'disabled'}`}>
      <OverLay />
      <img src={loading} alt="로딩 스피너" />
    </div>
  );
};

export default LoadingSpinner;

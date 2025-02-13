import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import OverLay from './Modal/OverLay';
import loading from 'assets/images/loading.gif';
import { MUTATION_KEYS } from 'constants/reactQueryKeys';
import 'styles/components/common/loading-spinner.scss';

const LoadingSpinner = () => {
  const isFetching = useIsFetching();
  const isLoginMutating = useIsMutating({
    mutationKey: [MUTATION_KEYS.login],
  });
  const isLoading = !!(isFetching || isLoginMutating);
  
  return (
    <div className={`loading-spinner ${isLoading ? undefined : 'disabled'}`}>
      <OverLay />
      <img src={loading} alt="로딩 스피너" />
    </div>
  );
};

export default LoadingSpinner;

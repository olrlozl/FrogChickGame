import loadingSpinner from 'assets/images/loading.gif';

export const LocalLoadingSpinner = () => {
  return (
    <div className='local-loading-spinner'>
      <img src={loadingSpinner} alt="로딩 스피너" />
    </div>
  );
};

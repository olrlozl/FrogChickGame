import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import LandingPage from 'pages/LandingPage';
import MainPage from 'pages/MainPage';
import PlayPage from 'pages/PlayPage';
import RankPage from 'pages/RankPage';
import MainLayout from 'components/common/Layout/MainLayout';
import GuidePage from 'pages/GuidePage';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { checkAuthLoader, clearAndRedirectToLanding } from 'utils/auth';
import { useEffect } from 'react';
import Modal from 'components/common/Modal/Modal';
import { modalProps } from 'constants/modal';
import { setAxiosInterceptorResponse } from 'api/axiosInstance';
import { queryClient } from 'api/queryClient';
import LoadingSpinner from 'components/common/LoadingSpinner';
import { useErrorStore } from 'stores/errorStore';

const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/play', element: <PlayPage />, loader: checkAuthLoader },
  { path: '/auth', element: <LandingPage /> },
  {
    path: '/main',
    element: <MainLayout />,
    loader: checkAuthLoader,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: 'rank',
        element: <RankPage />,
      },
      {
        path: 'guide',
        element: <GuidePage />,
      },
    ],
  },
]);

function App() {
  const { errorMessage, setErrorMessage, clearErrorMessage } = useErrorStore();

  const handleClickCloseReLoginModalAndRedirectHome = () => {
    clearErrorMessage();
    clearAndRedirectToLanding();
  };

  useEffect(() => {
    setAxiosInterceptorResponse(setErrorMessage);
  });

  const handleClickModalAction =
    errorMessage === '다시 로그인 해주세요.'
      ? handleClickCloseReLoginModalAndRedirectHome
      : clearErrorMessage;
      
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <LoadingSpinner />
        <Modal
          isOpen={!!errorMessage}
          message={errorMessage}
          messageFontSize={modalProps.error.messageFontSize}
          btns={[
            {
              label: modalProps.error.btns[0].label,
              onClick: handleClickModalAction,
              type: modalProps.error.btns[0].type,
            },
          ]}
        />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </div>
  );
}

export default App;

import {
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import './App.css';
import LandingPage from 'pages/LandingPage';
import MainPage from 'pages/MainPage';
import PlayPage from 'pages/PlayPage';
import RankPage from 'pages/RankPage';
import MainLayout from 'components/common/Layout/MainLayout';
import GuidePage from 'pages/GuidePage';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { checkAuthLoader } from 'utils/auth';
import { useEffect } from 'react';
import Modal from 'components/common/Modal/Modal';
import { modalProps } from 'constants/modal';
import instance, { setAxiosInterceptorResponse } from 'api/axiosInstance';
import { queryClient } from 'api/queryClient';
import LoadingSpinner from 'components/common/LoadingSpinner';
import { useErrorStore } from 'stores/errorStore';
import { useClear } from 'hooks/common/useClear';
import { ERROR_MESSAGES } from 'constants/errorMessages';

const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/play', element: <PlayPage />, loader: checkAuthLoader },
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
        loader: checkAuthLoader,
      },
      {
        path: 'guide',
        element: <GuidePage />,
        loader: checkAuthLoader,
      },
    ],
  },
]);

function App() {
  const { errorMessage, setErrorMessage, clearErrorMessage } = useErrorStore();
  const clearAndNavigateToLanding = useClear();

  useEffect(() => {
    const interceptorId = setAxiosInterceptorResponse(setErrorMessage);
    return () => {
      // 기존 인터셉터 제거
      instance.interceptors.response.eject(interceptorId);
    };
  }, []);

  const handleClickModalAction =
    errorMessage === ERROR_MESSAGES.COMMON.MISSING_JWT_ACCESS_TOKEN
      ? clearAndNavigateToLanding
      : clearErrorMessage;

  const { btns } = modalProps.error;

  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <LoadingSpinner />
        <Modal
          isOpen={!!errorMessage}
          message={errorMessage}
          btns={btns}
          buttonActions={[handleClickModalAction]}
        />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </div>
  );
}

export default App;

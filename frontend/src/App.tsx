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
import { queryClient } from 'api/queryClient';
import LoadingSpinner from 'components/common/LoadingSpinner';
import { ProtectedRoute } from 'components/common/ProtectedRoute';
import { useEffect } from 'react';
import instance, { setAxiosInterceptorResponse } from 'api/axiosInstance';
import { useErrorStore } from 'stores/errorStore';
import { PublicRoute } from 'components/common/PublicRoute';

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [{ path: '/', element: <LandingPage /> }],
  },
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/play', element: <PlayPage /> },
      {
        path: '/main',
        element: <MainLayout />,
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
    ],
  },
]);

function App() {
  const { setErrorMessage } = useErrorStore();

  useEffect(() => {
    const interceptorId = setAxiosInterceptorResponse(setErrorMessage);
    return () => {
      // 기존 인터셉터 제거
      instance.interceptors.response.eject(interceptorId);
    };
  }, []);

  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <LoadingSpinner />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </div>
  );
}

export default App;

import { queryClient } from 'api/queryClient';

export const checkAuthLoader = () => {
  const jwtAccessToken = localStorage.getItem('jwtAccessToken');

  if (!jwtAccessToken) {
    window.location.href = '/';
  }

  return null;
};

export const clearAndRedirectToLanding = () => {
  localStorage.clear();
  queryClient.clear();
  window.location.href = '/'
};

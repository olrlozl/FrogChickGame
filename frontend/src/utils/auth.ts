import { redirect } from 'react-router-dom';

export const checkAuthLoader = () => {
  const jwtAccessToken = localStorage.getItem('jwtAccessToken');

  if (!jwtAccessToken) {
    return redirect('/');
  }

  return null;
};
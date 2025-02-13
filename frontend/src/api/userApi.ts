import {
  CreateNicknameParams,
  KakaoLoginParams,
  NoNicknameUserkakaoLoginResponse,
} from 'types/user';
import instance from './axiosInstance';
import { API_ENDPOINTS } from 'constants/apiEndpoints';
import axios from 'axios';

const kakaoLogin = async ({
  redirectUri,
  code,
}: KakaoLoginParams): Promise<NoNicknameUserkakaoLoginResponse | ''> => {
  const { data } = await instance.post(API_ENDPOINTS.KAKAO_LOGIN, {
    redirectUri,
    code,
  });
  return data;
};

const kakaoLogout = async () => {
  await instance.post(API_ENDPOINTS.KAKAO_LOGOUT);
};

const createNickname = async ({ userId, nickname }: CreateNicknameParams) => {
  await instance.post(API_ENDPOINTS.CREATE_NICKNAME, {
    userId,
    nickname,
  });
};

const refreshJwtAccessToken = async () => {
  await axios.post(
    process.env.REACT_APP_API_URL_DEV +
      '/api' +
      API_ENDPOINTS.REFRESH_JWT_ACCESS_TOKEN
  );
};

export { kakaoLogin, kakaoLogout, createNickname, refreshJwtAccessToken };

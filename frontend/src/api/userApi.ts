import {
  CreateUserParams,
  CreateUserResponse,
  KakaoLoginParams,
  refreshJwtAccessTokenResponse,
  SignedupUserkakaoLoginResponse,
  UnSignedupUserkakaoLoginResponse,
} from 'types/user';
import instance from './axiosInstance';
import { API_ENDPOINTS } from 'constants/apiEndpoints';
import axios from 'axios';

const kakaoLogin = async ({
  redirectUri,
  code,
}: KakaoLoginParams): Promise<
  SignedupUserkakaoLoginResponse | UnSignedupUserkakaoLoginResponse
> => {
  const { data } = await instance.post(API_ENDPOINTS.KAKAO_LOGIN, {
    redirectUri,
    code,
  });
  return data;
};

const kakaoLogout = async () => {
  await instance.post(API_ENDPOINTS.KAKAO_LOGOUT);
};

const createUser = async ({
  nickname,
  kakaoAccessToken,
}: CreateUserParams): Promise<CreateUserResponse> => {
  const { data } = await instance.post(
    API_ENDPOINTS.CREATE_USER,
    { nickname },
    {
      headers: {
        Authorization: `Bearer ${kakaoAccessToken}`,
      },
    }
  );
  return data;
};

const refreshJwtAccessToken = async (
  authorization: string
): Promise<refreshJwtAccessTokenResponse> => {
  const { data } = await axios.post(
    process.env.REACT_APP_API_URL_DEV +
      '/api' +
      API_ENDPOINTS.REFRESH_JWT_ACCESS_TOKEN,
    {},
    {
      headers: {
        Authorization: authorization,
      },
    }
  );
  return data;
};

export { kakaoLogin, kakaoLogout, createUser, refreshJwtAccessToken };

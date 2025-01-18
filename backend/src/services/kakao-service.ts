import axios from 'axios';
import dotenv from 'dotenv';
import HttpError from '../models/http-error';

dotenv.config();
const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;

const getKakaoTokens = async (redirectUri: string, code: string) => {
  try {
    // 인가 코드로 토큰 받기
    const response = await axios.post(
      'https://kauth.kakao.com/oauth/token',
      null,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
        params: {
          grant_type: 'authorization_code',
          client_id: KAKAO_REST_API_KEY,
          redirect_uri: redirectUri,
          code,
        },
      }
    );

    // 응답에서 액세스 토큰과 리프레시 토큰 받기
    const { access_token, refresh_token } = response.data;

    return { accessToken: access_token, refreshToken: refresh_token };
  } catch (error) {
    throw new HttpError('카카오 토큰 가져오기에 실패했습니다.', 500);
  }
};

const getUserKakaoId = async (accessToken: string) => {
  try {
    // 엑세스 토큰으로 사용자 정보 가져오기
    const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const kakaoId: number = response.data.id;
    return kakaoId;
  } catch (error) {
    throw new HttpError('카카오 사용자 정보 가져오기에 실패했습니다.', 500);
  }
};

const logoutKakao = async (accessToken: string) => {
  try {
    // 엑세스 토큰으로 로그아웃
    const response = await axios.post(
      'https://kapi.kakao.com/v1/user/logout',
      null,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new HttpError('카카오 로그아웃에 실패했습니다.', 500);
  }
};

export { getKakaoTokens, getUserKakaoId, logoutKakao };

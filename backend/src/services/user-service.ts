import axios, { AxiosError } from 'axios';
import dotenv from 'dotenv';
import HttpError from '../models/http-error';
import redisClient from '../config/redis-client';

dotenv.config();
const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;

// 인가 코드로 카카오 엑세스/리프레시 토큰과 만료 시간 받기
const getKakaoTokens = async (redirectUri: string, code: string) => {
  try {
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

    const {
      access_token,
      refresh_token,
      expires_in,
      refresh_token_expires_in,
    } = response.data;

    return {
      kakaoAccessToken: access_token,
      kakaoRefreshToken: refresh_token,
      kakaoAccessTokenExpirationTime: expires_in,
      kakaoRefreshTokenExpirationTime: refresh_token_expires_in,
    };
  } catch (error) {
    throw new HttpError(
      '카카오 토큰 발급에 실패했습니다.',
      500,
      'FAILED_GET_KAKAO_TOKEN'
    );
  }
};

// kakaoId와 카카오 엑세스 토큰 만료시간 조회
const getKakaoTokenInfo = async (kakaoAccessToken: string) => {
  try {
    const response = await axios.get(
      'https://kapi.kakao.com/v1/user/access_token_info',
      {
        headers: {
          Authorization: `Bearer ${kakaoAccessToken}`,
        },
      }
    );
    const { id, expires_in } = response.data;
    return { kakaoId: id, kakaoAccessTokenExpirationTime: expires_in };
  } catch (error) {
    if (
      error instanceof AxiosError &&
      error.response?.status === 401 &&
      error.response?.data.code === -401 &&
      error.response?.data.msg === 'this access token is already expired'
    ) {
      throw new HttpError(
        '카카오 액세스 토큰이 만료되었습니다.',
        401,
        'EXPIRED_KAKAO_ACCESS_TOKEN'
      );
    }
    throw new HttpError(
      '카카오 정보 조회에 실패했습니다.',
      500,
      'FAILED_GET_KAKAO_INFO'
    );
  }
};

// 카카오 엑세스 토큰으로 카카오 로그아웃
const logoutKakao = async (kakaoAccessToken: string) => {
  try {
    const response = await axios.post(
      'https://kapi.kakao.com/v1/user/logout',
      null,
      {
        headers: {
          Authorization: `Bearer ${kakaoAccessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new HttpError(
      '카카오 로그아웃에 실패했습니다.',
      500,
      'FAILED_KAKAO_LOGOUT'
    );
  }
};

// Redis에 카카오 엑세스 토큰 저장
const storeKakaoAccessTokenInRedis = async (
  userId: string,
  kakaoAccessToken: string
) => {
  try {
    await redisClient.set(`kakaoAccessToken:${userId}`, kakaoAccessToken, {
      EX: 3600, // 1시간 후 만료
    });
  } catch (error) {
    throw new HttpError(
      'Redis에 카카오 액세스 토큰 저장에 실패했습니다.',
      500,
      'FAILED_STORE_KAKAO_ACCESS_TOKEN'
    );
  }
};

// Redis에서 카카오 엑세스 토큰 조회
const getKakaoAccessTokenFromRedis = async (userId: string) => {
  try {
    const token = await redisClient.get(`kakaoAccessToken:${userId}`);
    if (!token) {
      throw new HttpError(
        '해당 사용자의 카카오 액세스 토큰을 찾을 수 없습니다.',
        404,
        'NOT_FOUND_KAKAO_ACCESS_TOKEN'
      );
    }
    return token;
  } catch (error) {
    throw new HttpError(
      'Redis에서 카카오 액세스 토큰 조회에 실패했습니다.',
      500,
      'FAILED_GET_KAKAO_ACCESS_TOKEN'
    );
  }
};

// Redis에서 카카오 엑세스 토큰 제거
const removeKakaoAccessTokenFromRedis = async (userId: string) => {
  try {
    await redisClient.del(`kakaoAccessToken:${userId}`);
  } catch (error) {
    throw new HttpError(
      'Redis에서 카카오 엑세스 토큰 제거에 실패했습니다.',
      500,
      'FAILED_REMOVE_KAKAO_ACCESS_TOKEN'
    );
  }
};

// Redis에 jwt 리프레시 토큰 저장
const storeJwtRefreshTokenInRedis = async (
  userId: string,
  jwtRefreshToken: string
) => {
  try {
    await redisClient.set(`jwtRefreshToken:${userId}`, jwtRefreshToken, {
      EX: 7 * 24 * 60 * 60, // 7일 후 만료
    });
  } catch (error) {
    throw new HttpError(
      'Redis에 jwt 리프레시 토큰 저장에 실패했습니다.',
      500,
      'FAILED_STORE_JWT_REFRESH_TOKEN'
    );
  }
};

// Redis에서 jwt 리프레시 토큰 조회
const getJwtRefreshTokenFromRedis = async (userId: string) => {
  try {
    const token = await redisClient.get(`jwtRefreshToken:${userId}`);
    if (!token) {
      throw new HttpError(
        '해당 사용자의 jwt 리프레시 토큰을 찾을 수 없습니다.',
        404,
        'NOT_FOUND_JWT_REFRESH_TOKEN'
      );
    }
    return token;
  } catch (error) {
    throw new HttpError(
      'Redis에서 jwt 리프레시 토큰 조회에 실패했습니다.',
      500,
      'FAILED_GET_JWT_REFRESH_TOKEN'
    );
  }
};

// Redis에서 jwt 리프레시 토큰 제거
const removeJwtRefreshTokenFromRedis = async (userId: string) => {
  try {
    await redisClient.del(`jwtRefreshToken:${userId}`);
  } catch (error) {
    throw new HttpError(
      'Redis에서 jwt 리프레시 토큰 제거에 실패했습니다.',
      500,
      'FAILED_REMOVE_JWT_REFRESH_TOKEN'
    );
  }
};

export {
  getKakaoTokens,
  getKakaoTokenInfo,
  logoutKakao,
  storeKakaoAccessTokenInRedis,
  getKakaoAccessTokenFromRedis,
  removeKakaoAccessTokenFromRedis,
  storeJwtRefreshTokenInRedis,
  getJwtRefreshTokenFromRedis,
  removeJwtRefreshTokenFromRedis,
};

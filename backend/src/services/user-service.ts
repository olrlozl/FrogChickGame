import axios from 'axios';
import dotenv from 'dotenv';
import HttpError from '../models/http-error';
import redisClient from '../config/redis-client';
import { TokenCategory } from '../types/token';
import User from '../models/user';

dotenv.config();
const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;

const findUserById = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new HttpError('사용자를 찾을 수 없습니다.', 401, 'INVALID_USERID');
  }
  return user;
};

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

// 카카오 엑세스 토큰으로 kakaoId 조회
const getKakaoId = async (kakaoAccessToken: string) => {
  try {
    const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${kakaoAccessToken}`,
      },
    });

    const kakaoId: number = response.data.id;
    return kakaoId;
  } catch (error) {
    throw new HttpError(
      'kakaoId 조회에 실패했습니다.',
      500,
      'FAILED_GET_KAKAOID'
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

// 카카오 엑세스 토큰 갱신하기
const refreshKakaoAccessToken = async (kakaoRefreshToken: string) => {
  try {
    const response = await axios.post(
      'https://kauth.kakao.com/oauth/token',
      null,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
        params: {
          grant_type: 'refresh_token',
          client_id: KAKAO_REST_API_KEY,
          refresh_token: kakaoRefreshToken,
        },
      }
    );

    const { access_token } = response.data;
    return access_token;
  } catch (error) {
    throw new HttpError(
      '카카오 엑세스 토큰 갱신 실패했습니다.',
      500,
      'FAILED_REFRESH_KAKAO_ACCESS_TOKEN'
    );
  }
};

// Redis에 토큰 저장
const storeTokenInRedis = async (
  userId: string,
  token: string,
  expirationTime: number,
  tokenCategory: TokenCategory
) => {
  const key = `${tokenCategory}Token:${userId}`;

  try {
    await redisClient.set(key, token, { EX: expirationTime });
  } catch (error) {
    throw new HttpError(
      'Redis에 토큰 저장에 실패했습니다.',
      500,
      'FAILED_STORE_TOKEN'
    );
  }
};

// Redis에서 토큰 조회
const getTokenFromRedis = async (
  userId: string,
  tokenCategory: TokenCategory
) => {
  const key = `${tokenCategory}Token:${userId}`;

  try {
    const token = await redisClient.get(key);
    if (!token) {
      throw new HttpError(
        '해당 사용자의 토큰을 찾을 수 없습니다.',
        404,
        'NOT_FOUND_TOKEN'
      );
    }
    return token;
  } catch (error) {
    throw new HttpError(
      'Redis에서 토큰 조회에 실패했습니다.',
      500,
      'FAILED_GET_TOKEN'
    );
  }
};

// Redis에서 토큰들 제거
const removeTokensFromRedis = async (userId: string) => {
  const keys = [
    `kakaoAccessToken:${userId}`,
    `kakaoRefreshToken:${userId}`,
    `jwtRefreshToken:${userId}`,
  ];

  try {
    await Promise.all(keys.map((key) => redisClient.del(key)));
  } catch (error) {
    throw new HttpError(
      'Redis에서 토큰 제거에 실패했습니다.',
      500,
      'FAILED_REMOVE_TOKEN'
    );
  }
};

export {
  findUserById,
  getKakaoTokens,
  getKakaoId,
  logoutKakao,
  refreshKakaoAccessToken,
  storeTokenInRedis,
  getTokenFromRedis,
  removeTokensFromRedis,
};

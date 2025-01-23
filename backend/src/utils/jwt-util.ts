import jwt from 'jsonwebtoken';
import HttpError from '../models/http-error';

const jwtSecretKey = process.env.JWT_SECRET_KEY || 'default_secret_key';

interface JwtPayload {
  userId: string;
}

const generateJwtAccessToken = (payload: JwtPayload) => {
  try {
    // jwt 엑세스 토큰 발급 (만료시간: 1시간)
    const jwtAccessToken = jwt.sign(payload, jwtSecretKey, { expiresIn: '1h' });
    return jwtAccessToken;
  } catch (error) {
    throw new HttpError(
      'jwt 엑세스 토큰 생성에 실패했습니다.',
      500,
      'FAILED_GENERATION_JWT_ACCESS_TOKEN'
    );
  }
};

const generateJwtRefreshToken = (payload: JwtPayload) => {
  try {
    // jwt 리프레시 토큰 발급 (만료시간: 7일)
    const jwtRefreshToken = jwt.sign(payload, jwtSecretKey, {
      expiresIn: '7d',
    });
    return jwtRefreshToken;
  } catch (error) {
    throw new HttpError(
      'jwt 리프레시 토큰 생성에 실패했습니다.',
      500,
      'FAILED_GENERATION_JWT_REFRESH_TOKEN'
    );
  }
};

export { generateJwtAccessToken, generateJwtRefreshToken };

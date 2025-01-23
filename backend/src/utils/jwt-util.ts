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

const verifyJwtToken = (jwtToken: string) => {
  try {
    // jwt 토큰 검증
    const decodedToken = jwt.verify(jwtToken, jwtSecretKey);

    if (
      decodedToken &&
      typeof decodedToken === 'object' &&
      'userId' in decodedToken
    ) {
      return decodedToken;
    } else {
      throw new HttpError(
        'jwt 토큰이 유효하지 않습니다.',
        401,
        'INVALID_JWT_TOKEN'
      );
    }
  } catch (error) {
    // jwt 토큰 만료 시
    if (error instanceof jwt.TokenExpiredError) {
      throw new HttpError(
        'jwt 토큰이 만료되었습니다.',
        401,
        'EXPIRED_JWT_TOKEN'
      );
    } else {
      throw new HttpError(
        'jwt 토큰 검증에 실패했습니다.',
        500,
        'FAILED_VERIFICATION_JWT_TOKEN'
      );
    }
  }
};

export { generateJwtAccessToken, generateJwtRefreshToken, verifyJwtToken };

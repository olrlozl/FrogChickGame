import jwt from 'jsonwebtoken';
import HttpError from '../models/http-error';

interface JwtPayload {
  userId: string;
}

type TokenType = 'access' | 'refresh';

const JWT_TOKEN_CONFIG: Record<
  TokenType,
  { secretKey: string; expirationTime: string }
> = {
  access: {
    secretKey: process.env.JWT_ACCESS_SECRET_KEY || 'default_access_secret_key',
    expirationTime: '1h', // 만료 시간 (1시간)
  },
  refresh: {
    secretKey:
      process.env.JWT_REFRESH_SECRET_KEY || 'default_refresh_secret_key',
    expirationTime: '7d', // 만료 시간 (7일)
  },
};

const generateJwtToken = (payload: JwtPayload, tokenType: TokenType) => {
  try {
    const { secretKey, expirationTime } = JWT_TOKEN_CONFIG[tokenType];

    const jwtToken = jwt.sign(payload, secretKey, {
      expiresIn: expirationTime,
    });
    return jwtToken;
  } catch (error) {
    throw new HttpError(
      'jwt 토큰 생성에 실패했습니다.',
      500,
      'FAILED_GENERATION_JWT_TOKEN'
    );
  }
};

const verifyJwtToken = (jwtToken: string, tokenType: TokenType) => {
  try {
    const { secretKey } = JWT_TOKEN_CONFIG[tokenType];

    // jwt 토큰 검증
    const decodedToken = jwt.verify(jwtToken, secretKey);

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
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new HttpError(
        'jwt 토큰이 유효하지 않습니다.',
        401,
        'INVALID_JWT_TOKEN'
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

const getUserIdFromJwtAccessToken = (jwtAccessToken: string) => {
  // jwt 엑세스 토큰에서 userId 추출
  const decodedToken = jwt.decode(jwtAccessToken);

  if (
    !decodedToken ||
    typeof decodedToken !== 'object' ||
    !('userId' in decodedToken)
  ) {
    throw new HttpError(
      'jwt 토큰이 유효하지 않습니다.',
      401,
      'INVALID_JWT_TOKEN'
    );
  }

  return decodedToken.userId;
};

export { generateJwtToken, verifyJwtToken, getUserIdFromJwtAccessToken };

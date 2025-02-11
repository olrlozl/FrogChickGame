import jwt from 'jsonwebtoken';
import HttpError from '../models/http-error';
import User from '../models/user';
import { TokenType } from '../types/token';
import { JWT_CONFIG } from '../constants/jwt';

const generateJwtToken = (userId: string, tokenType: TokenType) => {
  try {
    const { secretKey, expirationDuration } = JWT_CONFIG[tokenType];
    const payload = { userId };

    const jwtToken = jwt.sign(payload, secretKey, {
      expiresIn: expirationDuration,
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

const verifyJwtToken = async (jwtToken: string, tokenType: TokenType) => {
  try {
    const { secretKey } = JWT_CONFIG[tokenType];

    // jwt 토큰 검증
    const decodedToken = jwt.verify(jwtToken, secretKey);

    if (
      decodedToken &&
      typeof decodedToken === 'object' &&
      'userId' in decodedToken
    ) {
      // decodedToken에서 userId와 iat(토큰발행시간) 추출
      const { userId, iat } = decodedToken;

      if (!iat) {
        throw new HttpError(
          '토큰 발행 시간이 존재하지 않습니다.',
          400,
          'MISSING_IAT'
        );
      }

      // userId에 해당하는 사용자의 revokedAt 필드만 조회
      const user = await User.findById(userId).select('revokedAt');

      if (!user) {
        throw new HttpError(
          '사용자를 찾을 수 없습니다.',
          404,
          'USER_NOT_FOUND'
        );
      }

      // 토큰 발행시간 보다 DB의 revokedAt가 더 최신일 경우 토큰 무효화
      if (user.revokedAt && new Date(user.revokedAt) > new Date(iat * 1000)) {
        throw new HttpError(
          '이 토큰은 로그아웃된 사용자에 의한 것이므로 더 이상 유효하지 않습니다.',
          401,
          'REVOKED_JWT_TOKEN'
        );
      }

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
    } else if (error instanceof HttpError) {
      throw error;
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

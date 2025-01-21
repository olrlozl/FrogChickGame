import jwt from 'jsonwebtoken';
import HttpError from '../models/http-error';

interface JwtPayload {
  userId: string;
}

const generateJwtToken = (payload: JwtPayload): string => {
  const jwtSecretKey = process.env.JWT_SECRET_KEY || 'default_secret_key';
  try {
    // jwt 토큰 발급
    const token = jwt.sign(payload, jwtSecretKey, { expiresIn: '1h' });
    return token;
  } catch (error) {
    throw new HttpError('JWT 토큰 생성에 실패했습니다.', 500);
  }
};

export { generateJwtToken };

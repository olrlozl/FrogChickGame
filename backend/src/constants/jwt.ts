import { TokenType } from '../types/token';

export const JWT_CONFIG: Record<
  TokenType,
  { secretKey: string; expirationDuration: string; expirationSeconds: number }
> = {
  access: {
    secretKey: process.env.JWT_ACCESS_SECRET_KEY || 'default_access_secret_key',
    expirationDuration: '1h',
    expirationSeconds: 60 * 60,
  },
  refresh: {
    secretKey:
      process.env.JWT_REFRESH_SECRET_KEY || 'default_refresh_secret_key',
    expirationDuration: '7d',
    expirationSeconds: 7 * 24 * 60 * 60,
  },
};

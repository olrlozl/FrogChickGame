export type GameOptionType = 'stranger' | 'friend';

export interface UserInfoInterface {
  nickname: string;
  wins: number;
  losses: number;
}

// API 관련
export interface UnSignedupUserkakaoLoginResponse {
  jwtAccessToken: null;
  kakaoAccessToken: string;
}

export interface SignedupUserkakaoLoginResponse {
  jwtAccessToken: string;
  kakaoAccessToken: null;
}

export interface KakaoLoginParams {
  redirectUri: string;
  code: string;
}

export interface CreateUserResponse {
  jwtAccessToken: string;
}

export interface CreateUserParams {
  nickname: string;
  kakaoAccessToken: string;
}

export interface refreshJwtAccessTokenResponse {
  newJwtAccessToken: string;
}
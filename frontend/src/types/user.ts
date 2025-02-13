export type GameOptionType = 'stranger' | 'friend';

export interface UserInfoInterface {
  nickname: string;
  wins: number;
  losses: number;
}

// API 관련
export interface NoNicknameUserkakaoLoginResponse {
  userId: string;
}

export interface KakaoLoginParams {
  redirectUri: string;
  code: string;
}


export interface CreateNicknameParams {
  userId: string;
  nickname: string;
}
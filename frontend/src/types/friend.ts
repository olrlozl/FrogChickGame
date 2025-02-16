export interface SearchFriendParams {
  nickname: string;
}

export interface SearchFriendResponse {
  nickname: string;
  wins: number;
  losses: number;
  isSent: boolean;
  isFriend: boolean;
}

export interface ApplyFriendParams {
  to: string;
}

export type FriendStatus = 'online' | 'offline' | 'playing';
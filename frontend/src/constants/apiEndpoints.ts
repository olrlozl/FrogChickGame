export const API_ENDPOINTS = {
  KAKAO_LOGIN: '/user/login/kakao',
  KAKAO_LOGOUT: '/user/logout/kakao',
  CREATE_NICKNAME: '/user/nickname',
  REFRESH_JWT_ACCESS_TOKEN: '/user/refresh/jwt-access-token',
  SEARCH_FRIEND: '/friend/search',
  GET_FRIENDS: '/friend',
  APPLY_FRIEND: '/friend/apply',
  GET_FRIEND_RECEIPTS: '/friend/receipts',
  RECEPT_FRIEND: '/friend/recept',
  CANCEL_FRIEND_APPLY: (nickname: string) => `friend/${nickname}`,
  GET_RANK: '/rank'
}
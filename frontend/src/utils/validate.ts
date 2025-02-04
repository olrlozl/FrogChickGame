export const validateNickname = (nickname: string) => {
  const nicknameRegex = /^[가-힣a-zA-Z]{2,6}$/;
  if (nicknameRegex.test(nickname)) {
    return true
  }
  return false
}

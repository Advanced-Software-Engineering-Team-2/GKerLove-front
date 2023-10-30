export function checkEmail(email: string) {
  const emailRegExp = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  return emailRegExp.test(email)
}

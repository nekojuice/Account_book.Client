export const authService = {
  // 登入回傳資料
  data: null,
  // 登入
  login: async (user) => {
    const loginUrl = 'https://localhost:7185/api/Login'
    const response = await fetch(loginUrl, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'content-type': 'application/json'
      }
    })
    authService.data = await response.json()
    await authService.saveTokenToCookie() // 登入時儲存到cookie
    return authService.data
  },
  // 儲存token
  saveTokenToCookie: async () => {
    if (authService.data) {
      document.cookie = `token=${authService.data.returnData}`
    }
  },
  // 取得token
  get getToken() {
    return document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1')
  }
}

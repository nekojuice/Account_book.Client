export const authService = {
  // 登入回傳資料
  loginResponse: null,
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
    authService.loginResponse = response.clone()
    await authService.saveTokenToCookie() // 登入時儲存到cookie
    return response
  },
  // 儲存token
  saveTokenToCookie: async () => {
    if (authService.loginResponse.ok) {
      const responseData = await authService.loginResponse.json()
      document.cookie = `token=${responseData.returnData}`
    }
  },
  // 取得token
  get getToken() {
    return document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1')
  },
  // 登出，刪除cookie
  logout: () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }
}

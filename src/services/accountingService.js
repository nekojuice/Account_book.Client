import { authService } from '@/services/authService'

export const accountingService = {
  // 取得記帳資料
  getAllAccountingData: async () => {
    const requestUrl = 'https://localhost:7185/api/Accounting/GetAccounting'
    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authService.getToken}`,
        'content-type': 'application/json'
      }
    })
    const data = await response.json()
    return data
  },
  postInsertAccountingData: async (data) => {
    const loginUrl = 'https://localhost:7185/api/Accounting/InsertAccountingByMemberId'
    const response = await fetch(loginUrl, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${authService.getToken}`,
        'content-type': 'application/json'
      }
    })
    const result = await response.json()
    return result
  }
}

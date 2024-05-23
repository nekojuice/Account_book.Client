import { authService } from '@/services/authService'

export const accountingService = {
  // 取得記帳資料
  getAllAccountingData: async () => {
    const getUrl = 'https://localhost:7185/api/Accounting/GetAccounting'
    const response = await fetch(getUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authService.getToken}`,
        'content-type': 'application/json'
      }
    })
    const data = await response.json()
    return data
  }
}

import { authService } from '@/services/authService'

export const accountingService = {
  // 取得記帳資料
  getAllAccountingData: async () => {
    const requestUrl = 'https://localhost:7185/api/Accounting/GetAccounting'
    try {
      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authService.getToken}`,
          'content-type': 'application/json'
        }
      })
      if (!response.ok) throw new Error(response.status)

      const data = await response.json()
      return data
    } catch (error) {
      alert(`連線異常, 取得資料失敗, status code: ${error.message}`)
    }
  },
  postInsertAccountingData: async (data) => {
    const loginUrl = 'https://localhost:7185/api/Accounting/InsertAccountingByMemberId'
    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          Authorization: `Bearer ${authService.getToken}`,
          'content-type': 'application/json'
        }
      })
      if (!response.ok) throw new Error(response.status)

      const result = await response.json()
      return result
    } catch (error) {
      alert(`連線異常, 新增資料失敗, status code: ${error.message}`)
    }
  },
  putUpdateAccountingData: async (data) => {
    const loginUrl = 'https://localhost:7185/api/Accounting/UpdateAccounting'
    try {
      const response = await fetch(loginUrl, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          Authorization: `Bearer ${authService.getToken}`,
          'content-type': 'application/json'
        }
      })
      if (!response.ok) throw new Error(response.status)

      const result = await response.json()
      return result
    } catch (error) {
      alert(`連線異常, 修改資料失敗, status code: ${error.message}`)
    }
  },
  deleteAccountingData: async (data) => {
    const loginUrl = 'https://localhost:7185/api/Accounting/DeleteAccounting'
    try {
      const response = await fetch(loginUrl, {
        method: 'DELETE',
        body: JSON.stringify(data),
        headers: {
          Authorization: `Bearer ${authService.getToken}`,
          'content-type': 'application/json'
        }
      })
      if (!response.ok) throw new Error(response.status)

      const result = await response.json()
      return result
    } catch (error) {
      alert(`連線異常, 刪除資料失敗, status code: ${error.message}`)
    }
  }
}

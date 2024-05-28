import { authService } from '@/services/authService'

export const accountingService = {
  // 取得記帳資料
  getAllAccountingData: async () => {
    const requestUrl = 'https://localhost:7185/api/Accounting/GetAccounting'
    return await fetch(requestUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authService.getToken}`,
        'content-type': 'application/json'
      }
    })
  },
  // 新增
  postInsertAccountingData: async (data) => {
    const loginUrl = 'https://localhost:7185/api/Accounting/InsertAccountingByMemberId'
    return await fetch(loginUrl, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${authService.getToken}`,
        'content-type': 'application/json'
      }
    })
  },
  // 修改
  putUpdateAccountingData: async (data) => {
    const loginUrl = 'https://localhost:7185/api/Accounting/UpdateAccounting'
    return await fetch(loginUrl, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${authService.getToken}`,
        'content-type': 'application/json'
      }
    })
  },
  // 刪除
  deleteAccountingData: async (data) => {
    const loginUrl = 'https://localhost:7185/api/Accounting/DeleteAccounting'

    return await fetch(loginUrl, {
      method: 'DELETE',
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${authService.getToken}`,
        'content-type': 'application/json'
      }
    })
  }
}

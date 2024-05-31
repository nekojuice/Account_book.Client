import { authService } from '@/services/authService'
// const baseUrl = 'https://localhost:7185/api'
const baseUrl = import.meta.env.VITE_ACCBOOK_API_BASEURL

export const accountingService = {
  // 取得記帳資料
  getAllAccountingData: async () => {
    const requestUrl = `${baseUrl}/api/Accounting/GetAccounting`
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
    const loginUrl = `${baseUrl}/api/Accounting/InsertAccountingByMemberId`
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
    const loginUrl = `${baseUrl}/api/Accounting/UpdateAccounting`
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
    const loginUrl = `${baseUrl}/api/Accounting/DeleteAccounting`

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

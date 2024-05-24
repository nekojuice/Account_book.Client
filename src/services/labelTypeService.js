export const labelTypeService = {
  getAllLabelType: async () => {
    const requestUrl = 'https://localhost:7185/api/LabelType/Get'
    const response = await fetch(requestUrl, {
      method: 'GET'
    })
    const data = await response.json()
    return data
  }
}

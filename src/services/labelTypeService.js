export const labelTypeService = {
  getAllLabelType: async () => {
    const requestUrl = 'https://localhost:7185/api/LabelType/Get'
    try {
      const response = await fetch(requestUrl, {
        method: 'GET'
      })
      if (!response.ok) throw new Error(response.status)

      const data = await response.json()
      return data
    } catch (error) {
      console.log(error.message)
    }
  }
}

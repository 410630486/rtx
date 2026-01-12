import api from './api'

export const addStock = async (data) => {
  const response = await api.post('/inventory/in', data)
  return response.data
}

export const removeStock = async (data) => {
  const response = await api.post('/inventory/out', data)
  return response.data
}

export const getHistory = async (productId, params = {}) => {
  const response = await api.get(`/inventory/history/${productId}`, { params })
  return response.data || []
}

export const getAllRecords = async (params = {}) => {
  const response = await api.get('/inventory/records', { params })
  // Backend returns {success, data, pagination}
  // API interceptor returns response.data which is the full object
  return {
    data: response.data || [],
    pagination: response.pagination
  }
}

export const updateRecord = async (id, data) => {
  const response = await api.put(`/inventory/records/${id}`, data)
  return response.data
}

export const deleteRecord = async (id) => {
  const response = await api.delete(`/inventory/records/${id}`)
  return response
}

export default {
  addStock,
  removeStock,
  getHistory,
  getAllRecords,
  updateRecord,
  deleteRecord
}

import React, { useState, useEffect } from 'react'
import inventoryService from '../services/inventoryService'
import productService from '../services/productService'
import Loading from '../components/Loading'
import ErrorAlert from '../components/ErrorAlert'
import SuccessAlert from '../components/SuccessAlert'
import Pagination from '../components/Pagination'

const Inventory = () => {
  const [records, setRecords] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  
  // 篩選狀態
  const [filterType, setFilterType] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  
  // 分頁狀態
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  
  // 表單資料
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    type: 'in',
    reason: '',
    notes: ''
  })

  useEffect(() => {
    fetchProducts()
    fetchRecords()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
    fetchRecords()
  }, [filterType, startDate, endDate, pageSize])

  const fetchProducts = async () => {
    try {
      const products = await productService.getAllProducts()
      setProducts(products || [])
    } catch (err) {
      console.error('無法取得商品列表:', err)
    }
  }

  const fetchRecords = async () => {
    setLoading(true)
    try {
      const params = {
        type: filterType,
        startDate,
        endDate,
        page: currentPage,
        limit: pageSize
      }
      
      const response = await inventoryService.getAllRecords(params)
      setRecords(response.data || [])
      
      if (response.pagination) {
        setTotalPages(response.pagination.pages || Math.ceil(response.pagination.total / response.pagination.limit))
      }
      
      setError(null)
    } catch (err) {
      setError('無法載入庫存記錄')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.productId) errors.productId = '必須選擇商品'
    if (!formData.quantity || formData.quantity <= 0) errors.quantity = '數量必須 > 0'
    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setLoading(true)
    try {
      if (editingId) {
        // 更新現有記錄
        await inventoryService.updateRecord(editingId, {
          quantity: parseInt(formData.quantity),
          reason: formData.reason,
          notes: formData.notes
        })
        setSuccessMessage('記錄已更新')
      } else {
        // 新增記錄
        const submitData = {
          productId: formData.productId,
          quantity: parseInt(formData.quantity),
          reason: formData.reason || (formData.type === 'in' ? '進貨' : '出貨'),
          notes: formData.notes
        }

        if (formData.type === 'in') {
          await inventoryService.addStock(submitData)
          setSuccessMessage('進貨記錄已建立')
        } else {
          await inventoryService.removeStock(submitData)
          setSuccessMessage('出貨記錄已建立')
        }
      }
      
      setFormData({ productId: '', quantity: '', type: 'in', reason: '', notes: '' })
      setFormErrors({})
      setShowForm(false)
      setEditingId(null)
      setCurrentPage(1)
      fetchRecords()
      fetchProducts()
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message
      setError(errorMsg)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({ productId: '', quantity: '', type: 'in', reason: '', notes: '' })
    setFormErrors({})
    setShowForm(false)
    setEditingId(null)
  }

  const handleEdit = (record) => {
    // 防止 productId 為 null 的情況
    const productId = record.productId 
      ? (typeof record.productId === 'object' ? record.productId._id : record.productId)
      : ''
    
    setFormData({
      productId: productId,
      quantity: record.quantity.toString(),
      type: record.type,
      reason: record.reason,
      notes: record.notes || ''
    })
    setEditingId(record._id)
    setShowForm(true)
    setFormErrors({})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (window.confirm('確定要刪除此庫存記錄嗎？這將會回退相應的商品庫存。')) {
      setLoading(true)
      try {
        await inventoryService.deleteRecord(id)
        setSuccessMessage('記錄已刪除')
        fetchRecords()
        fetchProducts()
      } catch (err) {
        setError(err.response?.data?.message || err.message)
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">庫存管理</h1>

      <ErrorAlert message={error} onClose={() => setError(null)} />
      <SuccessAlert message={successMessage} onClose={() => setSuccessMessage('')} />

      {/* 新增/編輯記錄表單 */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingId ? '編輯庫存記錄' : '新增進出貨記錄'}
          </h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">進/出貨類型 *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 border rounded"
                disabled={editingId}
              >
                <option value="in">進貨 (+)</option>
                <option value="out">出貨 (-)</option>
              </select>
              {editingId && <p className="text-xs text-gray-500 mt-1">編輯時無法更改類型</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">商品 *</label>
              <select
                value={formData.productId}
                onChange={(e) => {
                  setFormData({ ...formData, productId: e.target.value })
                  setFormErrors({ ...formErrors, productId: '' })
                }}
                className={`w-full px-4 py-2 border rounded ${formErrors.productId ? 'border-red-500' : ''}`}
                disabled={editingId}
              >
                <option value="">-- 請選擇商品 --</option>
                {products.map(p => (
                  <option key={p._id} value={p._id}>
                    {p.name} (庫存: {p.quantity})
                  </option>
                ))}
              </select>
              {editingId && <p className="text-xs text-gray-500 mt-1">編輯時無法更改商品</p>}
              {formErrors.productId && <p className="text-red-500 text-sm mt-1">{formErrors.productId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">數量 *</label>
              <input
                type="number"
                placeholder="輸入數量"
                value={formData.quantity}
                onChange={(e) => {
                  setFormData({ ...formData, quantity: e.target.value })
                  setFormErrors({ ...formErrors, quantity: '' })
                }}
                min="1"
                className={`w-full px-4 py-2 border rounded ${formErrors.quantity ? 'border-red-500' : ''}`}
              />
              {formErrors.quantity && <p className="text-red-500 text-sm mt-1">{formErrors.quantity}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">原因</label>
              <input
                type="text"
                placeholder="輸入進出貨原因"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full px-4 py-2 border rounded"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">備註</label>
              <textarea
                placeholder="輸入其他備註信息"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows="2"
                className="w-full px-4 py-2 border rounded"
              />
            </div>

            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? '處理中...' : (editingId ? '更新' : '提交')}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 篩選工具欄 */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">類型篩選</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="">全部</option>
              <option value="in">進貨</option>
              <option value="out">出貨</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">開始日期</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">結束日期</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">每頁筆數</label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(parseInt(e.target.value))}
              className="w-full px-4 py-2 border rounded"
            >
              <option value={10}>10 筆</option>
              <option value={20}>20 筆</option>
              <option value={50}>50 筆</option>
            </select>
          </div>
        </div>
      </div>

      {/* 操作按鈕 */}
      <div className="mb-6">
        <button
          onClick={() => {
            setFormData({ productId: '', quantity: '', type: 'in', reason: '', notes: '' })
            setShowForm(!showForm)
            setEditingId(null)
            setFormErrors({})
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? '取消' : '+ 新增記錄'}
        </button>
      </div>

      {/* 庫存記錄表格 */}
      {loading ? (
        <Loading />
      ) : records.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center text-gray-500">
          <p className="text-lg">無庫存記錄</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="p-3 text-left">商品</th>
                  <th className="p-3 text-center">類型</th>
                  <th className="p-3 text-right">數量</th>
                  <th className="p-3 text-left">原因</th>
                  <th className="p-3 text-left">時間</th>
                  <th className="p-3 text-center">操作</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">
                      {record.productId && typeof record.productId === 'object'
                        ? record.productId.name
                        : '未知商品'}
                      {record.productId && typeof record.productId === 'object' && record.productId.sku && (
                        <div className="text-xs text-gray-500">{record.productId.sku}</div>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        record.type === 'in'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {record.type === 'in' ? '進貨' : '出貨'}
                      </span>
                    </td>
                    <td className="p-3 text-right font-semibold">
                      <span className={record.type === 'in' ? 'text-green-600' : 'text-red-600'}>
                        {record.type === 'in' ? '+' : '-'}{record.quantity}
                      </span>
                    </td>
                    <td className="p-3 text-sm">{record.reason}</td>
                    <td className="p-3 text-sm text-gray-600">
                      {new Date(record.timestamp).toLocaleString('zh-TW')}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(record)}
                          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                        >
                          編輯
                        </button>
                        <button
                          onClick={() => handleDelete(record._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                        >
                          刪除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  )
}

export default Inventory

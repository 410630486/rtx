import React, { useState, useEffect } from 'react'
import productService from '../services/productService'
import inventoryService from '../services/inventoryService'
import StatisticsCard from '../components/StatisticsCard'
import Loading from '../components/Loading'
import ErrorAlert from '../components/ErrorAlert'

const Home = () => {
  console.log('Home component rendering...')
  
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalInventoryValue: 0,
    lowStockCount: 0,
    recentRecords: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    console.log('Home useEffect triggered')
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    setLoading(true)
    setError(null)
    try {
      const [products, recordsResponse] = await Promise.all([
        productService.getAllProducts(),
        inventoryService.getAllRecords({ limit: 10 })
      ])

      console.log('Products:', products)
      console.log('Records Response:', recordsResponse)

      const records = recordsResponse?.data || []
      const totalValue = (products || []).reduce((sum, p) => sum + ((p.price || 0) * (p.quantity || 0)), 0)
      const lowStock = (products || []).filter(p => (p.quantity || 0) < 10).length

      setStats({
        totalProducts: (products || []).length,
        totalInventoryValue: totalValue,
        lowStockCount: lowStock,
        recentRecords: records
      })
    } catch (err) {
      console.error('無法載入統計資料:', err)
      setError('載入統計資料失敗: ' + (err.message || '未知錯誤'))
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading />

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorAlert message={error} onClose={() => setError(null)} />
        <button
          onClick={fetchStatistics}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          重新載入
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">系統總覽</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatisticsCard
          title="商品總數"
          value={stats.totalProducts}
          icon="📦"
          color="blue"
        />
        <StatisticsCard
          title="庫存總價值"
          value={`¥${stats.totalInventoryValue.toLocaleString()}`}
          icon="💰"
          color="green"
        />
        <StatisticsCard
          title="低庫存商品"
          value={stats.lowStockCount}
          icon="⚠️"
          color="red"
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">最近庫存異動</h2>
        {stats.recentRecords.length === 0 ? (
          <p className="text-gray-500 text-center py-8">暫無記錄</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="p-3 text-left">商品</th>
                  <th className="p-3 text-center">類型</th>
                  <th className="p-3 text-right">數量</th>
                  <th className="p-3 text-left">時間</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentRecords.map((record) => (
                  <tr key={record._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">
                      {record.productId && typeof record.productId === 'object'
                        ? record.productId.name
                        : '未知商品'}
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
                    <td className="p-3 text-sm text-gray-600">
                      {new Date(record.timestamp).toLocaleString('zh-TW')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home

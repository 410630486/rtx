import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/database.js'
import productRoutes from './routes/productRoutes.js'
import inventoryRoutes from './routes/inventoryRoutes.js'
import { corsMiddleware } from './middleware/corsMiddleware.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// 中間件
app.use(express.json())
app.use(corsMiddleware)

// 資料庫連線
connectDB()

// API 路由
app.use('/api/products', productRoutes)
app.use('/api/inventory', inventoryRoutes)

// 健康檢查端點
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// 根路由
app.get('/', (req, res) => {
  res.json({ message: '存貨管理系統 API 服務運行中' })
})

// 404 處理
app.use(notFoundHandler)

// 錯誤處理中間件
app.use(errorHandler)

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`後端服務已啟動：http://localhost:${PORT}`)
})

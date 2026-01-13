import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    // Docker MongoDB 連接字符串（帶認證）
    // 使用 127.0.0.1 而不是 localhost 以避免 IPv6 問題
    const mongoURI = process.env.MONGODB_URI || 'mongodb://admin:password@127.0.0.1:27017/inventory_system?authSource=admin'
    
    await mongoose.connect(mongoURI, {
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000
    })
    
    console.log('✅ MongoDB 連線成功（Docker）')
    console.log('📍 連接地址：' + mongoURI.split('@')[1])
    return true
  } catch (error) {
    console.error('⚠️  MongoDB 連線失敗:', error.message)
    console.log('\n💡 解決方案：')
    console.log('   1. 確保 Docker Desktop 正在運行')
    console.log('   2. 檢查 MongoDB 容器是否運行：docker ps')
    console.log('   3. 啟動 MongoDB 容器：')
    console.log('      docker run -d --name mongodb-inventory -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password mongo:latest')
    console.log('   4. 或使用本地 MongoDB（無 Docker）')
    console.log('\n📝 應用仍將在開發模式下繼續運行\n')
    return false
  }
}

export default connectDB

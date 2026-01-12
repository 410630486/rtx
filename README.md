# rtx
# 庫存管理系統 (Inventory Management System)

一個現代化的全棧庫存管理系統，包含完整的產品和庫存管理功能。

## 📋 項目特性

- ✅ 產品管理 (Product Management)
- ✅ 庫存追蹤 (Inventory Tracking)
- ✅ 實時數據統計
- ✅ 響應式設計
- ✅ RESTful API
- ✅ 錯誤處理和驗證

## 🏗️ 項目結構

```
finals/
├── backend/              # 後端服務
│   ├── server.js        # 主服務器入口
│   ├── package.json     # 項目依賴配置
│   ├── config/          # 數據庫配置
│   ├── controllers/      # 業務邏輯控制器
│   ├── middleware/       # 中間件 (CORS, 錯誤處理)
│   ├── models/          # 數據模型
│   └── routes/          # API 路由
├── frontend/            # 前端應用
│   ├── package.json     # 項目依賴配置
│   ├── vite.config.js   # Vite 配置
│   ├── tailwind.config.js # Tailwind CSS 配置
│   ├── public/          # 靜態資源
│   └── src/
│       ├── components/  # React 組件
│       ├── pages/       # 頁面
│       ├── services/    # API 服務
│       ├── context/     # 應用狀態管理
│       ├── App.jsx
│       └── main.jsx
└── README.md            # 項目文檔
```

## 🚀 快速開始

### 前置要求
- Node.js (v14 或更高版本)
- npm 或 yarn

### 後端安裝和啟動

```bash
cd backend
npm install
npm start
```

後端服務將在 `http://localhost:5000` 運行

### 前端安裝和啟動

```bash
cd frontend
npm install
npm run dev
```

前端應用將在 `http://localhost:5173` 運行

## 📚 API 文檔

### 產品路由 (`/api/products`)
- `GET /api/products` - 獲取所有產品
- `POST /api/products` - 創建新產品
- `GET /api/products/:id` - 獲取單個產品
- `PUT /api/products/:id` - 更新產品
- `DELETE /api/products/:id` - 刪除產品

### 庫存路由 (`/api/inventory`)
- `GET /api/inventory` - 獲取所有庫存記錄
- `POST /api/inventory` - 創建庫存記錄
- `GET /api/inventory/:id` - 獲取單條庫存記錄
- `PUT /api/inventory/:id` - 更新庫存記錄
- `DELETE /api/inventory/:id` - 刪除庫存記錄

## 🛠️ 技術棧

### 後端
- Node.js
- Express.js
- 數據庫配置在 `config/database.js`

### 前端
- React
- Vite (構建工具)
- Tailwind CSS (樣式框架)
- React Context (狀態管理)

## 📁 核心文件說明

### 後端核心文件
- [backend/server.js](../../backend/server.js) - Express 服務器主文件
- [backend/config/database.js](../../backend/config/database.js) - 數據庫配置
- [backend/models/Product.js](../../backend/models/Product.js) - 產品數據模型
- [backend/models/InventoryRecord.js](../../backend/models/InventoryRecord.js) - 庫存記錄模型
- [backend/controllers/productController.js](../../backend/controllers/productController.js) - 產品業務邏輯
- [backend/controllers/inventoryController.js](../../backend/controllers/inventoryController.js) - 庫存業務邏輯

### 前端核心文件
- [frontend/src/App.jsx](../../frontend/src/App.jsx) - 主應用組件
- [frontend/src/context/AppContext.jsx](../../frontend/src/context/AppContext.jsx) - 全局狀態管理
- [frontend/src/services/api.js](../../frontend/src/services/api.js) - API 基礎配置
- [frontend/src/services/productService.js](../../frontend/src/services/productService.js) - 產品服務
- [frontend/src/services/inventoryService.js](../../frontend/src/services/inventoryService.js) - 庫存服務

## 🎯 主要頁面

- **Home** - 首頁，顯示系統統計信息
- **Products** - 產品管理頁面
- **Inventory** - 庫存管理頁面

## 🤝 貢獻

歡迎提交 Pull Request 和 Issue

## 📝 許可證

MIT License

## ✉️ 聯繫方式

如有任何問題，請提交 Issue 或聯繫開發者
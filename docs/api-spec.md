# API 規格文件

## 概述
此文件詳細說明系統的 API 端點、請求/回應格式與錯誤處理方式。

## 基礎 URL
```
http://localhost:5000/api
```

---

## 產品 API (Product Endpoints)

### 1. 獲取所有產品
**端點:** `GET /products`

**參數:**
- `page` (query, optional): 頁碼，預設值為 1
- `limit` (query, optional): 每頁筆數，預設值為 10

**回應:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "product_id",
      "name": "產品名稱",
      "description": "產品描述",
      "price": 100,
      "category": "分類",
      "sku": "SKU代碼",
      "createdAt": "2026-01-13T00:00:00Z",
      "updatedAt": "2026-01-13T00:00:00Z"
    }
  ],
  "total": 50,
  "page": 1,
  "totalPages": 5
}
```

### 2. 獲取單一產品
**端點:** `GET /products/:id`

**回應:**
```json
{
  "success": true,
  "data": {
    "_id": "product_id",
    "name": "產品名稱",
    "description": "產品描述",
    "price": 100,
    "category": "分類",
    "sku": "SKU代碼"
  }
}
```

### 3. 建立產品
**端點:** `POST /products`

**請求體:**
```json
{
  "name": "產品名稱",
  "description": "產品描述",
  "price": 100,
  "category": "分類",
  "sku": "SKU代碼"
}
```

**回應:** 201 Created

### 4. 更新產品
**端點:** `PUT /products/:id`

**請求體:**
```json
{
  "name": "更新後的產品名稱",
  "price": 150
}
```

**回應:** 200 OK

### 5. 刪除產品
**端點:** `DELETE /products/:id`

**回應:** 200 OK

---

## 庫存 API (Inventory Endpoints)

### 1. 獲取庫存記錄
**端點:** `GET /inventory`

**參數:**
- `page` (query, optional): 頁碼
- `limit` (query, optional): 每頁筆數

**回應:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "inventory_id",
      "productId": "product_id",
      "quantity": 100,
      "warehouseLocation": "A1",
      "lastRestocked": "2026-01-13T00:00:00Z"
    }
  ]
}
```

### 2. 更新庫存
**端點:** `PUT /inventory/:id`

**請求體:**
```json
{
  "quantity": 150,
  "warehouseLocation": "B2"
}
```

**回應:** 200 OK

---

## 錯誤回應

### 通用錯誤格式
```json
{
  "success": false,
  "message": "錯誤訊息",
  "status": 400
}
```

### 常見錯誤代碼
- `400`: 不良請求 (Bad Request)
- `404`: 資源未找到 (Not Found)
- `500`: 伺服器錯誤 (Internal Server Error)

---
import InventoryRecord from '../models/InventoryRecord.js'
import Product from '../models/Product.js'

// 進貨
export const addStock = async (req, res) => {
  try {
    const { productId, quantity, reason, notes } = req.body

    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: '缺少必填欄位'
      })
    }

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: '商品不存在'
      })
    }

    // 更新商品數量
    product.quantity += parseInt(quantity)
    await product.save()

    // 記錄進貨
    const record = new InventoryRecord({
      productId,
      type: 'in',
      quantity: parseInt(quantity),
      reason: reason || '進貨',
      notes: notes || ''
    })
    await record.save()

    res.status(201).json({
      success: true,
      message: '進貨記錄已建立',
      data: record
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '進貨失敗',
      error: error.message
    })
  }
}

// 出貨
export const removeStock = async (req, res) => {
  try {
    const { productId, quantity, reason, notes } = req.body

    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: '缺少必填欄位'
      })
    }

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: '商品不存在'
      })
    }

    if (product.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: '庫存不足'
      })
    }

    // 更新商品數量
    product.quantity -= parseInt(quantity)
    await product.save()

    // 記錄出貨
    const record = new InventoryRecord({
      productId,
      type: 'out',
      quantity: parseInt(quantity),
      reason: reason || '出貨',
      notes: notes || ''
    })
    await record.save()

    res.status(201).json({
      success: true,
      message: '出貨記錄已建立',
      data: record
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '出貨失敗',
      error: error.message
    })
  }
}

// 取得庫存歷史（支援分頁）
export const getInventoryHistory = async (req, res) => {
  try {
    const { productId } = req.params
    const { page = 1, limit = 20 } = req.query
    
    const query = { productId }

    // 計算總數
    const total = await InventoryRecord.countDocuments(query)

    // 分頁計算
    const pageNum = Math.max(1, parseInt(page))
    const pageSize = Math.max(1, Math.min(100, parseInt(limit)))
    const skip = (pageNum - 1) * pageSize

    const records = await InventoryRecord.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(pageSize)

    res.json({
      success: true,
      data: records,
      pagination: {
        total,
        page: pageNum,
        limit: pageSize,
        pages: Math.ceil(total / pageSize)
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '無法取得庫存歷史',
      error: error.message
    })
  }
}

// 取得所有庫存記錄（支援篩選、分頁、排序）
export const getAllRecords = async (req, res) => {
  try {
    const {
      type = '',
      page = 1,
      limit = 20,
      startDate = '',
      endDate = ''
    } = req.query

    // 構建查詢條件
    const query = {}

    // 篩選類型
    if (type && ['in', 'out'].includes(type)) {
      query.type = type
    }

    // 日期範圍篩選
    if (startDate || endDate) {
      query.timestamp = {}
      if (startDate) {
        query.timestamp.$gte = new Date(startDate)
      }
      if (endDate) {
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)
        query.timestamp.$lte = end
      }
    }

    // 計算總數
    const total = await InventoryRecord.countDocuments(query)

    // 分頁計算
    const pageNum = Math.max(1, parseInt(page))
    const pageSize = Math.max(1, Math.min(100, parseInt(limit)))
    const skip = (pageNum - 1) * pageSize

    // 執行查詢
    const records = await InventoryRecord.find(query)
      .populate('productId', 'name sku')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(pageSize)

    res.json({
      success: true,
      data: records,
      pagination: {
        total,
        page: pageNum,
        limit: pageSize,
        pages: Math.ceil(total / pageSize)
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '無法取得庫存記錄',
      error: error.message
    })
  }
}

// 更新庫存記錄
export const updateRecord = async (req, res) => {
  try {
    const { id } = req.params
    const { quantity, reason, notes } = req.body

    const record = await InventoryRecord.findById(id)
    if (!record) {
      return res.status(404).json({
        success: false,
        message: '庫存記錄不存在'
      })
    }

    const product = await Product.findById(record.productId)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: '關聯商品不存在'
      })
    }

    // 計算數量差異並更新商品庫存
    const oldQuantity = record.quantity
    const newQuantity = parseInt(quantity)
    const quantityDiff = newQuantity - oldQuantity

    if (record.type === 'in') {
      product.quantity += quantityDiff
    } else {
      product.quantity -= quantityDiff
      if (product.quantity < 0) {
        return res.status(400).json({
          success: false,
          message: '更新後庫存不足'
        })
      }
    }

    await product.save()

    // 更新記錄
    record.quantity = newQuantity
    if (reason !== undefined) record.reason = reason
    if (notes !== undefined) record.notes = notes
    await record.save()

    res.json({
      success: true,
      message: '庫存記錄已更新',
      data: record
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新失敗',
      error: error.message
    })
  }
}

// 刪除庫存記錄
export const deleteRecord = async (req, res) => {
  try {
    const { id } = req.params

    const record = await InventoryRecord.findById(id)
    if (!record) {
      return res.status(404).json({
        success: false,
        message: '庫存記錄不存在'
      })
    }

    const product = await Product.findById(record.productId)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: '關聯商品不存在'
      })
    }

    // 回退商品庫存
    if (record.type === 'in') {
      product.quantity -= record.quantity
      if (product.quantity < 0) {
        return res.status(400).json({
          success: false,
          message: '刪除此記錄會導致庫存不足'
        })
      }
    } else {
      product.quantity += record.quantity
    }

    await product.save()
    await InventoryRecord.findByIdAndDelete(id)

    res.json({
      success: true,
      message: '庫存記錄已刪除',
      data: record
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '刪除失敗',
      error: error.message
    })
  }
}

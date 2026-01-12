import Product from '../models/Product.js'

// 取得所有商品（支援搜尋、篩選、分頁、排序）
export const getAllProducts = async (req, res) => {
  try {
    const {
      search = '',
      category = '',
      sortBy = 'createdAt',
      sortOrder = -1,
      page = 1,
      limit = 10
    } = req.query

    // 構建查詢條件
    const query = {}
    
    // 搜尋（名稱或 SKU）
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } }
      ]
    }

    // 篩選分類
    if (category) {
      query.category = category
    }

    // 計算總數
    const total = await Product.countDocuments(query)

    // 分頁計算
    const pageNum = Math.max(1, parseInt(page))
    const pageSize = Math.max(1, Math.min(100, parseInt(limit)))
    const skip = (pageNum - 1) * pageSize

    // 執行查詢
    const products = await Product.find(query)
      .sort({ [sortBy]: parseInt(sortOrder) })
      .skip(skip)
      .limit(pageSize)

    res.json({
      success: true,
      data: products,
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
      message: '無法取得商品列表',
      error: error.message
    })
  }
}

// 根據 ID 取得單個商品
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: '商品不存在'
      })
    }
    res.json({
      success: true,
      data: product
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '無法取得商品',
      error: error.message
    })
  }
}

// 新增商品
export const createProduct = async (req, res) => {
  try {
    const { name, quantity, price, description, sku, category } = req.body

    if (!name || quantity === undefined || price === undefined) {
      return res.status(400).json({
        success: false,
        message: '缺少必填欄位（名稱、數量、價格）'
      })
    }

    const product = new Product({
      name,
      quantity: parseInt(quantity),
      price: parseFloat(price),
      description: description || '',
      sku: sku || undefined,
      category: category || '未分類'
    })

    await product.save()
    res.status(201).json({
      success: true,
      message: '商品新增成功',
      data: product
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '新增商品失敗',
      error: error.message
    })
  }
}

// 更新商品
export const updateProduct = async (req, res) => {
  try {
    const { name, quantity, price, description, category } = req.body
    
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: '商品不存在'
      })
    }

    if (name) product.name = name
    if (quantity !== undefined) product.quantity = quantity
    if (price !== undefined) product.price = price
    if (description !== undefined) product.description = description
    if (category !== undefined) product.category = category

    await product.save()
    res.json({
      success: true,
      message: '商品更新成功',
      data: product
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新商品失敗',
      error: error.message
    })
  }
}

// 刪除商品
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: '商品不存在'
      })
    }

    res.json({
      success: true,
      message: '商品刪除成功',
      data: product
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '刪除商品失敗',
      error: error.message
    })
  }
}

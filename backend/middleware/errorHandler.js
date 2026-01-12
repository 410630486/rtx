export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `無法找到該路由: ${req.originalUrl}`
  })
}

export const errorHandler = (err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || '伺服器內部錯誤'
  })
}

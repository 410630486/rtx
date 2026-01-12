import express from 'express'
import {
  addStock,
  removeStock,
  getInventoryHistory,
  getAllRecords,
  updateRecord,
  deleteRecord
} from '../controllers/inventoryController.js'

const router = express.Router()

router.post('/in', addStock)
router.post('/out', removeStock)
router.get('/history/:productId', getInventoryHistory)
router.get('/records', getAllRecords)
router.put('/records/:id', updateRecord)
router.delete('/records/:id', deleteRecord)

export default router

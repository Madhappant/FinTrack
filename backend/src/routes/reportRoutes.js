import express from 'express';
import {
  getDashboardSummary,
  getMonthlyTrends,
  getExpenseByCategory,
  getTaxReport
} from '../controllers/reportController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/dashboard', getDashboardSummary);
router.get('/trends', getMonthlyTrends);
router.get('/expenses-by-category', getExpenseByCategory);
router.get('/tax', getTaxReport);

export default router;

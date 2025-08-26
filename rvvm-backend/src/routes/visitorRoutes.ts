import express from 'express';
import {
  registerVisitor,
  quickCheckIn,
  getTodaysVisitors,
  getPendingApprovals,
  approveVisitor
} from '../controllers/visitorController';
import { authenticateToken, requireHost } from '../middleware/auth';

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', registerVisitor);
router.post('/quick-checkin', quickCheckIn);

// Protected routes (authentication required)
router.get('/today', authenticateToken, getTodaysVisitors);
router.get('/pending-approvals', authenticateToken, requireHost, getPendingApprovals);
router.put('/approve/:visitId', authenticateToken, requireHost, approveVisitor);

export default router;

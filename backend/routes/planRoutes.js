import express from 'express';
import { createPlan, getPlans, updatePlan, deletePlan, subscribeToPlan } from '../controller/planController.js';
import { protect, adminOnly } from '../middleware/authmiddleware.js';

const router = express.Router();

router.get('/all', getPlans);
router.post('/subscribe', protect, subscribeToPlan);

// Admin only routes
router.post('/add', protect, adminOnly, createPlan);
router.put('/update/:id', protect, adminOnly, updatePlan);
router.delete('/delete/:id', protect, adminOnly, deletePlan);

export default router;

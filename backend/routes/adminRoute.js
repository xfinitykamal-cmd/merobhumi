import express from 'express';
import {
  getAdminStats,
  getAllAppointments,
  updateAppointmentStatus,
  updatePropertyStatus,
  getAllUsers
} from '../controller/adminController.js';
import { protect, adminOnly } from '../middleware/authmiddleware.js';

const router = express.Router();

// All admin routes are protected
router.use(protect, adminOnly);

router.get('/stats', getAdminStats);
router.get('/appointments', getAllAppointments);
router.put('/appointments/status', updateAppointmentStatus);
router.put('/properties/status', updatePropertyStatus);
router.get('/users', getAllUsers);

export default router;
import express from 'express';
import { createInquiry, getMyLeads, getMyInquiries, getAllInquiries, updateInquiryStatus } from '../controllers/inquiryController.js';
import { protect, adminOnly } from '../middleware/authmiddleware.js';

const inquiryRouter = express.Router();

// Public route to submit an inquiry
inquiryRouter.post('/', (req, res, next) => {
    if (req.headers.authorization) {
        return protect(req, res, next);
    }
    next();
}, createInquiry);

// Private route for users
inquiryRouter.get('/my-leads', protect, getMyLeads);
inquiryRouter.get('/my-sent', protect, getMyInquiries);

// Admin Only: All inquiries
inquiryRouter.get('/all', protect, adminOnly, getAllInquiries);

// Update status (Admin or Seller)
inquiryRouter.patch('/:id/status', protect, updateInquiryStatus);

export default inquiryRouter;

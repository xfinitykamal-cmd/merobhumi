import express from 'express';
import { searchProperties, getLocationTrends } from '../controller/propertyController.js';
import { transformAISearchRequest } from '../middleware/transformRequest.js';

const router = express.Router();

// Original route (backend format)
router.post('/properties/search', searchProperties);

// Alias route for new frontend — transforms its request format first
router.post('/ai/search', transformAISearchRequest, searchProperties);

// Route to get location trends
router.get('/locations/:city/trends', getLocationTrends);

export default router;
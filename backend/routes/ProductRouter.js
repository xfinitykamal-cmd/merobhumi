import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/Usermodel.js';
import { addproperty, listproperty, removeproperty, updateproperty, singleproperty } from '../controller/productcontroller.js';
import upload from '../middleware/multer.js';
import { protect } from '../middleware/authmiddleware.js';

const propertyrouter = express.Router();

const optionalAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select("-password");
            if (user) req.user = user;
        }
    } catch (error) {
        // Silently fail auth for optional routes
    }
    next();
};

propertyrouter.post('/add', protect, upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
]), addproperty);

propertyrouter.get('/list', optionalAuth, listproperty);

propertyrouter.post('/remove', protect, removeproperty);

propertyrouter.post('/update', protect, upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
]), updateproperty);

propertyrouter.get('/single/:id', singleproperty);

export default propertyrouter;
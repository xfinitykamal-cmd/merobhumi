import Inquiry from '../models/Inquiry.js';
import Property from '../models/propertymodel.js';

export const createInquiry = async (req, res) => {
    try {
        const { propertyId, buyerName, buyerEmail, buyerPhone, message } = req.body;

        // Find property to get the seller ID
        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ success: false, message: 'Property not found' });
        }

        // Ensure seller ID is present
        const sellerId = property.owner || property.userId || property.user;
        if (!sellerId) {
            console.warn('⚠️ Property has no owner:', propertyId);
        }

        const inquiry = await Inquiry.create({
            property: propertyId,
            buyer: req.user ? req.user._id : null,
            buyerName,
            buyerEmail,
            buyerPhone,
            seller: sellerId,
            message
        });

        res.status(201).json({ success: true, inquiry });
    } catch (error) {
        console.error('Inquiry Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getMyLeads = async (req, res) => {
    try {
        const sellerId = req.user.id || req.user._id;
        const leads = await Inquiry.find({ seller: sellerId })
            .populate('property', 'title price location images')
            .sort({ createdAt: -1 });

        res.json({ success: true, leads });
    } catch (error) {
        console.error('Fetch Leads Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getMyInquiries = async (req, res) => {
    try {
        const buyerId = req.user.id || req.user._id;
        const inquiries = await Inquiry.find({ buyer: buyerId })
            .populate('property', 'title price location images')
            .sort({ createdAt: -1 });

        res.json({ success: true, inquiries });
    } catch (error) {
        console.error('Fetch Inquiries Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ADMIN ONLY: Get all inquiries across the platform
export const getAllInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find()
            .populate('property', 'title price location')
            .populate('buyer', 'name email')
            .populate('seller', 'name email')
            .sort({ createdAt: -1 });

        res.json({ success: true, inquiries });
    } catch (error) {
        console.error('Fetch All Inquiries Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Toggle or update inquiry status
export const updateInquiryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const inquiry = await Inquiry.findById(id);
        if (!inquiry) {
            return res.status(404).json({ success: false, message: 'Inquiry not found' });
        }

        // Authorization: Admin can do anything, Seller can only update their own leads
        const isOwner = inquiry.seller.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        inquiry.status = status;
        await inquiry.save();

        res.json({ success: true, message: 'Status updated', inquiry });
    } catch (error) {
        console.error('Update Status Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

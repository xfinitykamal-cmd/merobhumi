import fs from "fs";
import imagekit from "../config/imagekit.js";
import Property from "../models/propertymodel.js";
import User from "../models/Usermodel.js";
import Plan from "../models/planmodel.js";

const addproperty = async (req, res) => {
    try {
        console.log("Receiving property data:", req.body);
        const {
            title, location, price, beds, baths, sqft,
            type, availability, description, phone,
            googleMapLink, coordinates
        } = req.body;

        // Plan Limit Check (Skip for Admin)
        if (req.user.role !== 'admin') {
            const user = await User.findById(req.user._id).populate('activeSubscription.plan');
            if (!user.activeSubscription?.plan) {
                return res.status(403).json({ success: false, message: "Active subscription required to list properties" });
            }

            const { plan, usedListings, expiryDate } = user.activeSubscription;

            // Check expiry
            if (new Date() > new Date(expiryDate)) {
                return res.status(403).json({ success: false, message: "Your subscription has expired" });
            }

            if (usedListings >= plan.listingLimit) {
                return res.status(403).json({ success: false, message: "Listing limit reached for your current plan" });
            }
        }

        // Handle amenities (might be sent as amenities[0], amenities[1] etc.)
        let amenitiesArray = [];
        if (req.body.amenities) {
            amenitiesArray = Array.isArray(req.body.amenities) ? req.body.amenities : [req.body.amenities];
        } else {
            // Check for amenities[0], amenities[1] etc.
            Object.keys(req.body).forEach(key => {
                if (key.startsWith('amenities[')) {
                    amenitiesArray.push(req.body[key]);
                }
            });
        }

        // Images processing
        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        if (images.length === 0) {
            return res.status(400).json({ success: false, message: "At least one image is required" });
        }

        // Upload images to ImageKit
        const imageUrls = await Promise.all(
            images.map(async (item) => {
                try {
                    // Check for real credentials
                    const isPlaceholder = !process.env.IMAGEKIT_PRIVATE_KEY || process.env.IMAGEKIT_PRIVATE_KEY === 'default_private_key';

                    if (isPlaceholder) {
                        console.log("ImageKit in placeholder mode, using dummy URL for:", item.originalname);
                        if (item.path && fs.existsSync(item.path)) {
                            fs.unlink(item.path, () => { });
                        }
                        return `https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80`;
                    }

                    const result = await imagekit.upload({
                        file: fs.readFileSync(item.path),
                        fileName: item.originalname,
                        folder: "Property",
                    });
                    fs.unlink(item.path, (err) => {
                        if (err) console.log("Error deleting the file: ", err);
                    });
                    return result.url;
                } catch (uploadError) {
                    console.error("ImageKit upload error:", uploadError);
                    if (process.env.NODE_ENV === 'development') {
                        return "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80";
                    }
                    throw uploadError;
                }
            })
        );

        // Parse coordinates if provided as string
        let parsedCoordinates = coordinates;
        if (typeof coordinates === 'string') {
            try {
                parsedCoordinates = JSON.parse(coordinates);
            } catch (e) {
                console.error("Error parsing coordinates:", e);
            }
        }

        // Create a new product with safe numeric conversions
        const product = new Property({
            title,
            location,
            price: Number(price) || 0,
            beds: Number(beds) || 0,
            baths: Number(baths) || 0,
            sqft: Number(sqft) || 0,
            type,
            availability,
            description,
            amenities: amenitiesArray,
            image: imageUrls,
            phone,
            googleMapLink: googleMapLink || '',
            coordinates: parsedCoordinates,
            owner: req.user._id,
            status: 'pending'
        });

        // Save the product to the database
        await product.save();

        // Increment user's used listings (Skip for Admin)
        if (req.user.role !== 'admin') {
            await User.findByIdAndUpdate(req.user._id, {
                $inc: { 'activeSubscription.usedListings': 1 }
            });
        }

        res.json({ message: "Product added successfully", success: true });
    } catch (error) {
        console.error("Detailed Error adding product:", error);
        res.status(500).json({
            message: "Server Error: " + error.message,
            success: false
        });
    }
};

const listproperty = async (req, res) => {
    try {
        const { status, owner } = req.query;
        let query = { status: 'approved' }; // Default: only show approved properties

        // Admin can see all statuses or specific status
        if (req.user?.role === 'admin' && status) {
            query = status === 'all' ? {} : { status };
        }

        // Filter by specific owner (e.g. "My Listings")
        if (owner === 'me' && req.user) {
            query = { owner: req.user._id };
        }

        const property = await Property.find(query).sort({ createdAt: -1 });
        res.json({ property, success: true });
    } catch (error) {
        console.error("Error listing properties:", error);
        res.status(500).json({
            message: "Server Error: " + error.message,
            success: false
        });
    }
};

const removeproperty = async (req, res) => {
    try {
        const { id } = req.body;
        const property = await Property.findById(id);

        if (!property) {
            return res.status(404).json({ message: "Property not found", success: false });
        }

        // Ownership Check: Only owner or admin can delete
        if (property.owner?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Not authorized to delete this property", success: false });
        }

        await Property.findByIdAndDelete(id);
        return res.json({ message: "Property removed successfully", success: true });
    } catch (error) {
        console.log("Error removing product: ", error);
        return res.status(500).json({ message: "Server Error: " + error.message, success: false });
    }
};

const updateproperty = async (req, res) => {
    try {
        const { id, title, location, price, beds, baths, sqft, type, availability, description, amenities, phone, googleMapLink } = req.body;

        const property = await Property.findById(id);
        if (!property) {
            console.log("Property not found with ID:", id); // Debugging line
            return res.status(404).json({ message: "Property not found", success: false });
        }

        // Ownership Check: Only owner or admin can update
        if (property.owner?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Not authorized to update this property", success: false });
        }

        if (!req.files) {
            // No new images provided
            property.title = title;
            property.location = location;
            property.price = price;
            property.beds = beds;
            property.baths = baths;
            property.sqft = sqft;
            property.type = type;
            property.availability = availability;
            property.description = description;
            property.amenities = amenities;
            property.phone = phone;
            property.googleMapLink = googleMapLink || '';
            // Keep existing images
            await property.save();
            return res.json({ message: "Property updated successfully", success: true });
        }

        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        // Upload images to ImageKit and delete after upload
        const imageUrls = await Promise.all(
            images.map(async (item) => {
                const result = await imagekit.upload({
                    file: fs.readFileSync(item.path),
                    fileName: item.originalname,
                    folder: "Property",
                });
                fs.unlink(item.path, (err) => {
                    if (err) console.log("Error deleting the file: ", err);
                });
                return result.url;
            })
        );

        property.title = title;
        property.location = location;
        property.price = price;
        property.beds = beds;
        property.baths = baths;
        property.sqft = sqft;
        property.type = type;
        property.availability = availability;
        property.description = description;
        property.amenities = amenities;
        property.image = imageUrls;
        property.phone = phone;
        property.googleMapLink = googleMapLink || '';

        await property.save();
        res.json({ message: "Property updated successfully", success: true });
    } catch (error) {
        console.log("Error updating product: ", error);
        res.status(500).json({ message: "Server Error: " + error.message, success: false });
    }
};

const singleproperty = async (req, res) => {
    try {
        const { id } = req.params;
        const property = await Property.findById(id);
        if (!property) {
            return res.status(404).json({ message: "Property not found", success: false });
        }
        res.json({ property, success: true });
    } catch (error) {
        console.log("Error fetching property:", error);
        res.status(500).json({ message: "Server Error: " + error.message, success: false });
    }
};

export { addproperty, listproperty, removeproperty, updateproperty, singleproperty };
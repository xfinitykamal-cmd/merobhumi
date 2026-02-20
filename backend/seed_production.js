import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Property from './models/propertymodel.js';
import User from './models/Usermodel.js';
import Inquiry from './models/Inquiry.js';

dotenv.config();

const propertyImages = [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1628191010210-a59de33e5941?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600585154526-990dced4ea0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600573472592-401b489a59cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600585152220-90363ae7e11f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600047509807-ba8f99d629f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600566753086-00f18efc2291?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
];

const locations = [
    "Baluwatar, Kathmandu", "Jhamsikhel, Lalitpur", "Bhaisepati, Lalitpur",
    "Budhanilkantha, Kathmandu", "Lazimpat, Kathmandu", "Thamel, Kathmandu",
    "Lakeside, Pokhara", "Sedi, Pokhara", "Hemja, Pokhara",
    "Bharatpur, Chitwan", "Sauraha, Chitwan",
    "Hetauda, Makwanpur", "Dharan, Sunsari", "Biratnagar, Morang",
    "Sanepa, Lalitpur", "Bansbari, Kathmandu", "Maharajgunj, Kathmandu"
];

const propertyTypes = ["House", "Apartment", "Villa", "Commercial"];
const amenitiesList = [
    "Parking", "Garden", "Wi-Fi", "Security", "Backup Power",
    "Balcony", "Gym", "Swimming Pool", "Elevator", "Air Conditioning",
    "Water Supply", "Modular Kitchen", "Servant Quarters"
];

const generateDescription = (type, location, beds) => {
    return "Experience luxury living in this exquisite " + type.toLowerCase() + " located in the heart of " + location + ". Featuring " + beds + " spacious bedrooms, modern architecture, and premium finishes throughout. The property offers abundant natural light, a fully equipped modular kitchen, and expansive living areas perfect for entertaining. Situated in a highly desirable neighborhood with excellent connectivity to major commercial hubs, schools, and hospitals. Don't miss this opportunity to own a piece of premium real estate.";
};

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomMultiple = (arr, num) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
};
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

async function seedProperties() {
    try {
        console.log("Connecting to Database...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected Successfully.");

        // Find Admin User
        let admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            console.log("Admin user not found. Checking if an email is provided in .env...");
            if (process.env.ADMIN_EMAIL) {
                admin = await User.findOne({ email: process.env.ADMIN_EMAIL });
            }
        }

        if (!admin) {
            console.error("FATAL: Cannot find Admin user to assign properties to. Please ensure an admin exists.");
            process.exit(1);
        }
        console.log("Found Admin User: " + admin.name + " (" + admin.email + ")");

        console.log("Clearing all existing properties and inquiries...");
        await Property.deleteMany({});
        await Inquiry.deleteMany({});
        console.log("Cleared successfully.");

        console.log("Generating 50 premium properties...");
        const newProperties = [];

        for (let i = 0; i < 50; i++) {
            const isForSale = Math.random() > 0.3; // 70% for sale, 30% for rent
            const availability = isForSale ? "For Sale" : "For Rent";
            const type = getRandom(propertyTypes);
            const location = getRandom(locations);

            // Logic for realistic prices
            let basePrice = 0;
            if (isForSale) {
                if (type === 'Apartment') basePrice = getRandomInt(150, 400) * 100000; // 1.5Cr to 4Cr
                else if (type === 'Villa') basePrice = getRandomInt(500, 1500) * 100000; // 5Cr to 15Cr
                else if (type === 'Commercial') basePrice = getRandomInt(800, 2500) * 100000;
                else basePrice = getRandomInt(200, 800) * 100000; // House 2Cr to 8Cr
            } else {
                if (type === 'Apartment') basePrice = getRandomInt(25, 100) * 1000; // 25k to 100k
                else if (type === 'Commercial') basePrice = getRandomInt(50, 500) * 1000;
                else basePrice = getRandomInt(40, 200) * 1000; // House/Villa 40k to 200k
            }

            const beds = type === 'Commercial' ? 0 : getRandomInt(2, 6);
            const baths = type === 'Commercial' ? getRandomInt(1, 4) : getRandomInt(1, beds);
            const sqft = getRandomInt(10, 50) * 100; // 1000 to 5000 sqft

            const titleAdjectives = ["Luxurious", "Modern", "Premium", "Stunning", "Elegant", "Spacious", "Contemporary", "Exclusive"];
            const title = getRandom(titleAdjectives) + " " + type + " in " + location.split(',')[0];

            const property = {
                title,
                location,
                price: basePrice,
                image: getRandomMultiple(propertyImages, getRandomInt(3, 5)),
                beds,
                baths,
                sqft,
                type,
                availability,
                description: generateDescription(type, location, beds),
                amenities: getRandomMultiple(amenitiesList, getRandomInt(5, 10)),
                phone: "9800000000",
                isFeatured: Math.random() > 0.8, // 20% chance to be featured
                isVerified: true,
                status: 'approved',
                paymentStatus: 'paid',
                owner: admin._id,
                coordinates: {
                    lat: 27.7172 + (Math.random() - 0.5) * 0.1,
                    lng: 85.3240 + (Math.random() - 0.5) * 0.1
                }
            };

            newProperties.push(property);
        }

        await Property.insertMany(newProperties);
        console.log("Successfully seeded " + newProperties.length + " properties!");

        process.exit(0);
    } catch (error) {
        console.error("Seeding error:", error);
        process.exit(1);
    }
}

seedProperties();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Property from '../models/propertymodel.js';
import User from '../models/Usermodel.js';
import Appointment from '../models/appointmentModel.js';

dotenv.config({ path: './.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/merobhumi';

const properties = [
    {
        title: "Luxury Villa in Budhanilkantha",
        location: "Budhanilkantha, Kathmandu",
        price: 85000000,
        image: [
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
            "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800"
        ],
        beds: 5,
        baths: 4,
        sqft: 4500,
        type: "Villa",
        availability: "Available",
        description: "Experience unparalleled luxury in this stunning 5-bedroom villa located in the prestigious Budhanilkantha area. Featuring a private pool, landscaped gardens, and modern amenities.",
        amenities: ["Private Pool", "Garden", "Security", "Parking", "City View"],
        phone: "9801234567",
        googleMapLink: "https://maps.google.com/?q=Budhanilkantha,Kathmandu",
        isFeatured: true,
        isVerified: true
    },
    {
        title: "Modern Apartment in Jhamsikhel",
        location: "Jhamsikhel, Lalitpur",
        price: 25000000,
        image: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"
        ],
        beds: 3,
        baths: 2,
        sqft: 1800,
        type: "Apartment",
        availability: "Available",
        description: "Centrally located in the vibrant hub of Jhamsikhel, this modern 3-bedroom apartment offers convenience and style. Perfect for expatriates and families alike.",
        amenities: ["Elevator", "Backup Generator", "Gym", "Parking", "Water Treatment"],
        phone: "9801112223",
        googleMapLink: "https://maps.google.com/?q=Jhamsikhel,Lalitpur",
        isFeatured: true,
        isVerified: true
    },
    {
        title: "Traditional Heritage House in Bhaktapur",
        location: "Bhaktapur Durbar Square Area, Bhaktapur",
        price: 45000000,
        image: [
            "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800"
        ],
        beds: 4,
        baths: 3,
        sqft: 2200,
        type: "House",
        availability: "Available",
        description: "A beautifully restored traditional Newari house near Bhaktapur Durbar Square. Combines original craftsmanship with modern comforts.",
        amenities: ["Heritage Design", "Terrace", "Quiet Neighborhood", "Wood Flooring"],
        phone: "9841223344",
        googleMapLink: "https://maps.google.com/?q=Bhaktapur+Durbar+Square",
        isFeatured: true,
        isVerified: true
    },
    {
        title: "Lakeside Penthouse in Pokhara",
        location: "Lakeside, Pokhara",
        price: 38000000,
        image: [
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"
        ],
        beds: 3,
        baths: 3,
        sqft: 2500,
        type: "Apartment",
        availability: "Available",
        description: "Stunning penthouse overlooking Fewa Lake and the Machhapuchhre range. Fully furnished with high-end fixtures.",
        amenities: ["Lake View", "Mountain View", "Rooftop Terrace", "Fully Furnished"],
        phone: "9856012345",
        googleMapLink: "https://maps.google.com/?q=Lakeside,Pokhara",
        isFeatured: true,
        isVerified: true
    },
    {
        title: "Commercial Space in New Baneshwor",
        location: "New Baneshwor, Kathmandu",
        price: 120000000,
        image: [
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800"
        ],
        beds: 0,
        baths: 4,
        sqft: 5000,
        type: "Commercial",
        availability: "Available",
        description: "Prime commercial building in the heart of New Baneshwor. Ideal for banks, corporate offices, or retail outlets.",
        amenities: ["Prime Location", "Lift", "Basement Parking", "Fire Safety"],
        phone: "9808887776",
        googleMapLink: "https://maps.google.com/?q=New+Baneshwor,Kathmandu"
    },
    {
        title: "Residential Land in Budhanilkantha",
        location: "Deuba Chowk, Budhanilkantha",
        price: 45000000,
        image: [
            "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"
        ],
        beds: 0,
        baths: 0,
        sqft: 10800,
        type: "Land",
        availability: "Available",
        description: "Flat, south-facing 6-aana residential land perfect for building your dream home in a peaceful colony.",
        amenities: ["Road Access", "Water", "Electricity", "Drainage"],
        phone: "9841009988",
        googleMapLink: "https://maps.google.com/?q=Budhanilkantha"
    },
    {
        title: "Cozy Family Home in Bhaisepati",
        location: "Bhaisepati, Lalitpur",
        price: 55000000,
        image: [
            "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800"
        ],
        beds: 4,
        baths: 3,
        sqft: 2800,
        type: "House",
        availability: "Available",
        description: "Beautifully designed 2.5-story house in the quiet residential area of Bhaisepati. Features a private yard and sunny rooms.",
        amenities: ["Solar Water", "Modular Kitchen", "Parking", "Small Garden"],
        phone: "9803332211",
        googleMapLink: "https://maps.google.com/?q=Bhaisepati,Lalitpur"
    },
    {
        title: "Office Space in Lazimpat",
        location: "Lazimpat, Kathmandu",
        price: 150000,
        image: [
            "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800"
        ],
        beds: 0,
        baths: 2,
        sqft: 1200,
        type: "Commercial",
        availability: "Rent",
        description: "Fully furnished office space available for rent in the central Lazimpat area. Perfect for creative agencies or startups.",
        amenities: ["Furnished", "AC", "High Speed Internet", "Parking"],
        phone: "9851010101",
        googleMapLink: "https://maps.google.com/?q=Lazimpat,Kathmandu"
    },
    {
        title: "Penthouse at Central Park",
        location: "Bishalnagar, Kathmandu",
        price: 65000000,
        image: [
            "https://images.unsplash.com/photo-1567496898731-daec1b177ceb?w=800"
        ],
        beds: 4,
        baths: 4,
        sqft: 3200,
        type: "Apartment",
        availability: "Available",
        description: "Ultra-luxury penthouse at Central Park Apartments. Features double-height ceilings and panoramic city views.",
        amenities: ["Swimming Pool", "Club House", "Security", "Backup Power"],
        phone: "9800000001",
        googleMapLink: "https://maps.google.com/?q=Bishalnagar,Kathmandu"
    },
    {
        title: "Land in Pokhara with Lake View",
        location: "Sedi, Pokhara",
        price: 120000000,
        image: [
            "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800"
        ],
        beds: 0,
        baths: 0,
        sqft: 21600,
        type: "Land",
        availability: "Available",
        description: "Prime 12-aana land in Sedi with spectacular views of Fewa Lake. Excellent investment opportunity for a resort or hotel.",
        amenities: ["Lake View", "Road Access", "Tourism Hub"],
        phone: "9856098765",
        googleMapLink: "https://maps.google.com/?q=Sedi,Pokhara"
    },
    {
        title: "Bunglow in Chandol",
        location: "Chandol, Kathmandu",
        price: 72000000,
        image: [
            "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800"
        ],
        beds: 5,
        baths: 4,
        sqft: 3500,
        type: "House",
        availability: "Available",
        description: "Elegant 5-bedroom bungalow in the peaceful locality of Chandol. Includes servant quarters and a spacious backyard.",
        amenities: ["Modular Kitchen", "Backyard", "Solar Panels", "Servant Room"],
        phone: "9841887766",
        googleMapLink: "https://maps.google.com/?q=Chandol,Kathmandu"
    },
    {
        title: "Modern Duplex in Hattiban",
        location: "Hattiban, Lalitpur",
        price: 22000000,
        image: [
            "https://images.unsplash.com/photo-1628592102751-ba83b035e07c?w=800"
        ],
        beds: 3,
        baths: 3,
        sqft: 1600,
        type: "Apartment",
        availability: "Available",
        description: "Stylish 3-bedroom duplex apartment in Hattiban. Great community living with common open spaces.",
        amenities: ["Security", "Community Hall", "Parking", "Quiet Area"],
        phone: "9802224466",
        googleMapLink: "https://maps.google.com/?q=Hattiban,Lalitpur"
    },
    {
        title: "Studio Apartment in Sanepa",
        location: "Sanepa, Lalitpur",
        price: 75000,
        image: [
            "https://images.unsplash.com/photo-1536376074432-ef214704046d?w=800"
        ],
        beds: 1,
        baths: 1,
        sqft: 600,
        type: "Apartment",
        availability: "Rent",
        description: "Chic studio apartment in the expat-friendly Sanepa area. Walkable distance to many cafes and restaurants.",
        amenities: ["Fully Furnished", "AC", "Laundry", "24/7 Security"],
        phone: "9801110000",
        googleMapLink: "https://maps.google.com/?q=Sanepa,Lalitpur"
    },
    {
        title: "Historic House in Patan",
        location: "Patan Durbar Square Area, Lalitpur",
        price: 52000000,
        image: [
            "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800"
        ],
        beds: 4,
        baths: 2,
        sqft: 2000,
        type: "House",
        availability: "Available",
        description: "Authentic Newari house with complex wood carvings near Patan Durbar Square. A true gem for heritage lovers.",
        amenities: ["Terrace", "Traditional Arch", "Prime Heritage Site"],
        phone: "9841334455",
        googleMapLink: "https://maps.google.com/?q=Patan+Durbar+Square"
    },
    {
        title: "Farm Land in Chitwan",
        location: "Sauraha, Chitwan",
        price: 15000000,
        image: [
            "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"
        ],
        beds: 0,
        baths: 0,
        sqft: 43200,
        type: "Land",
        availability: "Available",
        description: "Large 1-bigha farm land near Sauraha. Ideal for organic farming or a boutique resort.",
        amenities: ["Fertile Soil", "River Proximity", "Quiet Location"],
        phone: "9855011223",
        googleMapLink: "https://maps.google.com/?q=Sauraha,Chitwan"
    },
    {
        title: "Skyline Views Apartment",
        location: "Gairidhara, Kathmandu",
        price: 28000000,
        image: [
            "https://images.unsplash.com/photo-1493397212122-2b85edf8106b?w=800"
        ],
        beds: 3,
        baths: 2,
        sqft: 1550,
        type: "Apartment",
        availability: "Available",
        description: "North-facing apartment in Gairidhara with clear views of the Himalayas on sunny days.",
        amenities: ["Himalayan View", "Central Location", "Parking", "Security"],
        phone: "9801234123",
        googleMapLink: "https://maps.google.com/?q=Gairidhara,Kathmandu"
    },
    {
        title: "Villa in Sarangkot",
        location: "Sarangkot, Pokhara",
        price: 42000000,
        image: [
            "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800"
        ],
        beds: 3,
        baths: 3,
        sqft: 2200,
        type: "Villa",
        availability: "Available",
        description: "Beautiful vacation home in Sarangkot. Wake up to the best sunrise views in Nepal.",
        amenities: ["Sunrise View", "Mountain Trails", "Balcony", "Garden"],
        phone: "9856011111",
        googleMapLink: "https://maps.google.com/?q=Sarangkot,Pokhara"
    },
    {
        title: "Retail Space in Civil Mall",
        location: "Sundhara, Kathmandu",
        price: 250000,
        image: [
            "https://images.unsplash.com/photo-1567449303078-57ad995bd301?w=800"
        ],
        beds: 0,
        baths: 1,
        sqft: 450,
        type: "Commercial",
        availability: "Rent",
        description: "Prime retail outlet space in Civil Mall. Excellent foot traffic and visibility.",
        amenities: ["High Footfall", "Central AC", "Maintenance Included"],
        phone: "9809998887",
        googleMapLink: "https://maps.google.com/?q=Civil+Mall,Kathmandu"
    },
    {
        title: "Lawn House in Bansbari",
        location: "Bansbari, Kathmandu",
        price: 98000000,
        image: [
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"
        ],
        beds: 6,
        baths: 5,
        sqft: 5200,
        type: "House",
        availability: "Available",
        description: "Magnificent 6-bedroom house with a massive lush green lawn in Bansbari. Perfect for large families.",
        amenities: ["Large Lawn", "Modular Kitchen", "Garage", "Pantry"],
        phone: "9841999888",
        googleMapLink: "https://maps.google.com/?q=Bansbari,Kathmandu"
    },
    {
        title: "Luxury Retreat in Nagarkot",
        location: "Nagarkot, Bhaktapur",
        price: 35000000,
        image: [
            "https://images.unsplash.com/photo-1549517045-bc93de075e53?w=800"
        ],
        beds: 4,
        baths: 4,
        sqft: 2600,
        type: "Villa",
        availability: "Available",
        description: "Your own private getaway in the clouds. This Nagarkot villa offers peace, quiet, and stunning nature.",
        amenities: ["Fireplace", "Mountain View", "Private Driveway", "Terrace"],
        phone: "9812345678",
        googleMapLink: "https://maps.google.com/?q=Nagarkot,Bhaktapur"
    }
];

const users = [
    {
        name: "Anish Shrestha",
        email: "anish@merobhumi.com",
        password: "password123"
    },
    {
        name: "Sita Poudel",
        email: "sita@merobhumi.com",
        password: "password123"
    },
    {
        name: "Ram Bahadur",
        email: "ram@merobhumi.com",
        password: "password123"
    }
];

async function seed() {
    try {
        console.log('🌱 Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected.');

        // Clear existing data
        console.log('🧹 Clearing existing data...');
        await Property.deleteMany({});
        await User.deleteMany({});
        await Appointment.deleteMany({});
        console.log('✅ Data cleared.');

        // Seed Properties
        console.log('🏘️ Seeding properties...');
        const createdProperties = await Property.insertMany(properties);
        console.log(`✅ ${createdProperties.length} properties created.`);

        // Seed Users
        console.log('👤 Seeding users...');
        const saltedUsers = await Promise.all(users.map(async (u) => ({
            ...u,
            password: await bcrypt.hash(u.password, 10)
        })));
        const createdUsers = await User.insertMany(saltedUsers);
        console.log(`✅ ${createdUsers.length} users created.`);

        // Seed Appointments
        console.log('📅 Seeding appointments...');
        const appointmentData = [
            {
                propertyId: createdProperties[0]._id,
                guestInfo: { name: "Guest User 1", email: "guest1@example.com", phone: "9801234567" },
                date: new Date(Date.now() + 86400000), // Tomorrow
                time: "10:00 AM",
                status: "pending",
                notes: "Interested in visiting the villa."
            },
            {
                propertyId: createdProperties[1]._id,
                userId: createdUsers[0]._id,
                date: new Date(Date.now() + 172800000), // Day after tomorrow
                time: "02:00 PM",
                status: "confirmed",
                meetingPlatform: "google-meet",
                meetingLink: "https://meet.google.com/abc-defg-hij"
            },
            {
                propertyId: createdProperties[2]._id,
                guestInfo: { name: "Local Buyer", email: "buyer@example.com", phone: "9841223344" },
                date: new Date(Date.now() - 86400000), // Yesterday
                time: "11:30 AM",
                status: "completed",
                feedback: { rating: 5, comment: "Amazing heritage property!" }
            }
        ];
        const createdAppointments = await Appointment.insertMany(appointmentData);
        console.log(`✅ ${createdAppointments.length} appointments created.`);

        console.log('\n🌟 Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seed();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/Usermodel.js';
import Property from './models/propertymodel.js';
import Plan from './models/planmodel.js';

const uri = 'mongodb+srv://xfinitykamal_db_user:DmwfnqaCQDbjrAHV@merobhumimongodb.uxowmhw.mongodb.net/test?appName=merobhumimongodb';

const nepalLocations = [
    { city: 'Kathmandu', area: 'Baneshwor' }, { city: 'Kathmandu', area: 'Lalitpur' },
    { city: 'Kathmandu', area: 'Bhaktapur' }, { city: 'Kathmandu', area: 'Balaju' },
    { city: 'Pokhara', area: 'Lakeside' }, { city: 'Pokhara', area: 'Bagar' },
    { city: 'Chitwan', area: 'Bharatpur' }, { city: 'Butwal', area: 'Milanchowk' },
    { city: 'Dharan', area: 'Bhanuchowk' }, { city: 'Biratnagar', area: 'Main Road' },
    { city: 'Hetauda', area: 'School Road' }, { city: 'Janakpur', area: 'Ramananda Chowk' }
];

const propertyTypes = ['House', 'Apartment', 'Land', 'Office', 'Commercial'];
const availabilities = ['Sale', 'Rent'];

const generatePrice = (type) => {
    if (type === 'Land') return Math.floor(Math.random() * 5000000) + 1000000;
    if (type === 'Apartment') return Math.floor(Math.random() * 8000000) + 5000000;
    return Math.floor(Math.random() * 30000000) + 10000000;
};

const seedMegaData = async () => {
    try {
        await mongoose.connect(uri);
        console.log('✅ Connected to Production DB (test)');

        // 1. Ensure Admin and Test User exist
        const hashedPassword = await bcrypt.hash('password123', 10);

        let admin = await User.findOne({ email: 'admin@merobhumi.com' });
        if (!admin) {
            admin = await User.create({
                name: 'System Admin',
                email: 'admin@merobhumi.com',
                password: hashedPassword,
                role: 'admin'
            });
            console.log('✅ Admin user created');
        }

        let testUser = await User.findOne({ email: 'user@merobhumi.com' });
        if (!testUser) {
            testUser = await User.create({
                name: 'Test Agent',
                email: 'user@merobhumi.com',
                password: hashedPassword,
                role: 'user'
            });
            console.log('✅ Test user created');
        }

        // 2. Clear existing properties
        await Property.deleteMany({});
        console.log('✅ Existing properties cleared');

        // 3. Generate 50 properties
        const properties = [];
        for (let i = 1; i <= 50; i++) {
            const locationObj = nepalLocations[Math.floor(Math.random() * nepalLocations.length)];
            const type = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
            const availability = availabilities[Math.floor(Math.random() * availabilities.length)];
            const owner = i <= 25 ? admin._id : testUser._id;

            properties.push({
                title: `${availability === 'Sale' ? 'Luxury' : 'Modern'} ${type} in ${locationObj.area}`,
                location: `${locationObj.area}, ${locationObj.city}`,
                price: generatePrice(type),
                beds: type === 'Land' ? 0 : Math.floor(Math.random() * 5) + 1,
                baths: type === 'Land' ? 0 : Math.floor(Math.random() * 4) + 1,
                sqft: Math.floor(Math.random() * 4000) + 500,
                type: type,
                availability: availability,
                description: `This beautiful ${type.toLowerCase()} in ${locationObj.area} offers prime living with all modern amenities. Located in a peaceful neighborhood of ${locationObj.city}, it is perfect for families and investors alike.`,
                amenities: ['Water', 'Electricity', 'Parking', 'Security'],
                image: [
                    `https://images.unsplash.com/photo-1580587771525-78b9bed3bafc?q=80&w=800&auto=format&fit=crop`,
                    `https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop`
                ],
                phone: '+977-9800000000',
                googleMapLink: 'https://maps.google.com',
                status: 'approved',
                owner: owner,
                isFeatured: i % 5 === 0, // Every 5th property is featured
                isVerified: true
            });
        }

        await Property.insertMany(properties);
        console.log('✅ 50 properties seeded successfully!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error during mega seeding:', error.message);
        process.exit(1);
    }
};

seedMegaData();

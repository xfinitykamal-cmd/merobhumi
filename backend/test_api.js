import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const URL = 'https://real-estate-website-backend-zfu7.onrender.com';

async function testAPI() {
    try {
        console.log("Logging in as Admin...");
        const loginRes = await axios.post(`${URL}/api/users/admin`, {
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD
        });

        const token = loginRes.data.token;
        console.log("Admin Token Acquired.");

        console.log("Fetching /api/inquiries/all ...");
        const res = await axios.get(`${URL}/api/inquiries/all`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Success! Data:");
        console.log(res.data);
    } catch (error) {
        if (error.response) {
            console.error("API Error Response:", error.response.status, error.response.data);
        } else {
            console.error("Network/Other Error:", error.message);
        }
    }
}

testAPI();

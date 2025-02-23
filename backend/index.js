const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const connectDB = require('./config/db');
const router = require('./routes'); // Correctly importing the router from Routes
const multer = require('multer');
const app = express();
const path = require('path');
const cron = require('node-cron'); // Importing node-cron
const User = require('./models/userModel');

require('dotenv').config();

const fs = require('fs');

app.use(cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow cookies and other credentials
}));

// router.get('/health', (req, res) => {
//     res.status(200).json({ message: 'Server is healthy' });
// });

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", router); // Mounting the router correctly on the '/api' pat

app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    next();
});

const PORT = process.env.PORT || 8080;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Connected to DB");
        console.log(`Server is running on port ${PORT}`);
    });


    cron.schedule('0 0 1 * *', async () => {
        try {
            await User.updateMany({}, { 'businessPrices.totalPurchase': 0 });
            console.log('Total purchase values reset to 0 for all users.');
        } catch (error) {
            console.error('Error resetting total purchases:', error);
        }
    });
    
});


// app.use(cors({
//     origin: (origin, callback) => {
//         if (!origin || origin === 'https://ymlmart.com' || origin === 'http://localhost:3000') {
//             callback(null, true);
//         } else {
//             callback(null, true);
//         }
//     },
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true, // Allow cookies and other credentials
// }));

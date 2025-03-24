const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const path = require('path');
require('dotenv').config();
const session = require('express-session');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const medicalRecordRoutes = require('./routes/medicalRecordRoutes');
const ratingRoutes = require('./routes/ratingRoutes');

const app = express();

// Middleware
app.use(cors({
    origin: '*',  // Trong môi trường phát triển, bạn có thể cho phép tất cả origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Phục vụ files tĩnh
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/ratings', ratingRoutes);

// Cập nhật tùy chọn cookie
app.use(session({
    // ...các config khác
    cookie: {
        secure: true, // Đặt true nếu sử dụng HTTPS
        sameSite: 'none', // Quan trọng cho cross-origin requests
        domain: '.vercel.app', // Tùy chọn
        maxAge: 24 * 60 * 60 * 1000 // 1 ngày
    }
}));

// Thêm CORS headers trực tiếp
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin === 'https://medical-frontend-six.vercel.app' ||
        origin === 'http://localhost:3000') {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    next();
});

// Log tất cả requests để debug
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Database connection and server start
const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Kết nối database thành công');

        // Sync models with database with altered option to handle foreign key constraints
        await sequelize.sync({
            alter: true,  // Cho phép thay đổi cấu trúc bảng nếu cần
            force: false  // Không xóa dữ liệu hiện có
        });
        console.log('Đồng bộ models thành công');

        app.listen(PORT, () => {
            console.log(`Server đang chạy tại http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Không thể kết nối đến database:', error);

        // Start server anyway even if database connection fails
        app.listen(PORT, () => {
            console.log(`Server đang chạy tại http://localhost:${PORT} (Không có kết nối database)`);
            console.log('Hãy đảm bảo MySQL/XAMPP đang chạy và thử lại');
        });
    }
}

startServer();  
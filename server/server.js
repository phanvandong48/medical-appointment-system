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

// Xác định môi trường hiện tại
const isProduction = process.env.NODE_ENV === 'production';
console.log(`Môi trường hiện tại: ${isProduction ? 'production' : 'development'}`);

// Cấu hình CORS dựa trên môi trường
const allowedOrigins = isProduction
    ? ['https://medical-frontend-six.vercel.app', 'https://your-other-production-domain.com']
    : ['http://localhost:3000'];

app.use(cors({
    origin: function (origin, callback) {
        // Cho phép yêu cầu không có origin (như mobile apps, curl, postman)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1 || !isProduction) {
            callback(null, true);
        } else {
            callback(new Error('Bị chặn bởi CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// Cấu hình session trước khi sử dụng routes
app.use(session({
    secret: process.env.SESSION_SECRET || 'medical-app-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: isProduction, // Chỉ bật secure trong production
        sameSite: isProduction ? 'none' : 'lax', // Cấu hình sameSite phù hợp
        maxAge: 24 * 60 * 60 * 1000 // 1 ngày
    }
}));

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

// Thêm CORS headers trực tiếp cho các trường hợp đặc biệt
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin) || !isProduction) {
        res.setHeader('Access-Control-Allow-Origin', origin || '*');
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

// Thêm route health check cho Railway
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Database connection and server start
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Kết nối database thành công');

        // Đồng bộ models với database
        await sequelize.sync({
            alter: true,  // Cho phép thay đổi bảng nếu cần
            force: false  // Không xóa dữ liệu hiện có
        });
        console.log('Đồng bộ models thành công');

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server đang chạy tại http://localhost:${PORT}`);
            console.log(`Trong môi trường: ${isProduction ? 'production' : 'development'}`);
        });
    } catch (error) {
        console.error('Không thể kết nối hoặc đồng bộ database:', error);

        // Start server anyway even if database connection fails
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server đang chạy tại http://localhost:${PORT} (Không có kết nối database)`);
            console.log('Hãy đảm bảo MySQL/XAMPP đang chạy và thử lại');
        });
    }
};

// Xử lý các lỗi không bắt được
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
});

startServer();  
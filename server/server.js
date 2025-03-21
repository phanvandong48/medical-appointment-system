const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const path = require('path');
require('dotenv').config();

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
app.use(cors());
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
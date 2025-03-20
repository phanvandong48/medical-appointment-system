const nodemailer = require('nodemailer');
require('dotenv').config();

// Cấu hình transporter
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Kiểm tra kết nối
transporter.verify((error, success) => {
    if (error) {
        console.log('Lỗi kết nối email:', error);
    } else {
        console.log('Server sẵn sàng gửi email');
    }
});

module.exports = transporter;
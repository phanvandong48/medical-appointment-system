const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false,
        // Thêm cấu hình sử dụng với XAMPP
        port: 3306, // Port mặc định của MySQL trong XAMPP
        dialectOptions: {
            // Tùy chọn bổ sung nếu cần
        }
    }
);

// Kiểm tra kết nối
sequelize.authenticate()
    .then(() => {
        console.log('Kết nối thành công đến MySQL thông qua XAMPP');
    })
    .catch(err => {
        console.error('Không thể kết nối đến cơ sở dữ liệu:', err);
    });

module.exports = sequelize;
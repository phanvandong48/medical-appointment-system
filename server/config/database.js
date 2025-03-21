const { Sequelize } = require('sequelize');
require('dotenv').config();

// Sử dụng mysql2 để hỗ trợ caching_sha2_password
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        dialectModule: require('mysql2'), // Thêm dòng này để sử dụng mysql2
        logging: false,
        // Thêm cấu hình sử dụng với XAMPP
        port: process.env.DB_PORT || 3306, // Port mặc định của MySQL trong XAMPP
        dialectOptions: {
            // Tùy chọn bổ sung nếu cần
        }
    }
);

// Kiểm tra kết nối
sequelize.authenticate()
    .then(() => {
        console.log('Kết nối thành công đến MySQL');
    })
    .catch(err => {
        console.error('Không thể kết nối đến cơ sở dữ liệu:', err);
    });

module.exports = sequelize;
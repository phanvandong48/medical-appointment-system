const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

// Xác định môi trường hiện tại
const isProduction = process.env.NODE_ENV === 'production';
console.log(`Môi trường hiện tại: ${isProduction ? 'production' : 'development'}`);

// Cấu hình database cho Railway
const productionConfig = {
    host: process.env.DB_HOST || 'ballast.proxy.rlwy.net',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'hSfkpwIqgtHkgKNtjNcDFUZeBcSEVOEx',
    database: process.env.DB_NAME || 'railway',
    port: process.env.DB_PORT || 54661,
    dialect: 'mysql',
    dialectModule: require('mysql2'),
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
};

// Cấu hình database cho localhost
const developmentConfig = {
    host: 'localhost',
    username: 'root',
    password: '',
    database: 'medical_appointment',
    port: 3306,
    dialect: 'mysql',
    dialectModule: require('mysql2'),
    logging: false
};

// Chọn cấu hình phù hợp dựa vào môi trường
const config = isProduction ? productionConfig : developmentConfig;

// Ưu tiên sử dụng URL nếu có (định dạng của Railway)
if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'mysql',
        dialectModule: require('mysql2'),
        logging: false,
        dialectOptions: {
            ssl: isProduction ? {
                require: true,
                rejectUnauthorized: false
            } : false
        }
    });
    console.log('Đang sử dụng chuỗi kết nối DATABASE_URL');
} else {
    // Sử dụng cấu hình đã chọn
    sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        {
            host: config.host,
            port: config.port,
            dialect: config.dialect,
            dialectModule: config.dialectModule,
            logging: config.logging,
            dialectOptions: config.dialectOptions
        }
    );
    console.log(`Đang sử dụng cấu hình database cho: ${isProduction ? 'Railway' : 'localhost'}`);
}

// Kiểm tra kết nối
sequelize.authenticate()
    .then(() => {
        console.log('Kết nối thành công đến MySQL');
    })
    .catch(err => {
        console.error('Không thể kết nối đến cơ sở dữ liệu:', err);
    });

module.exports = sequelize;
# Hệ Thống Đặt Lịch Khám Bệnh

Hệ thống đặt lịch khám bệnh trực tuyến cho phép bệnh nhân đặt lịch khám, quản lý lịch khám và đánh giá bác sĩ một cách dễ dàng.

## Tính Năng Chính

### Cho Bệnh Nhân
- Đăng ký và đăng nhập tài khoản
- Xem danh sách bác sĩ và thông tin chi tiết
- Đặt lịch khám trực tuyến
- Xem và quản lý lịch khám của mình
- Hủy lịch khám
- Đánh giá bác sĩ sau khi khám
- Xem hồ sơ bệnh án của mình

### Cho Bác Sĩ
- Đăng nhập vào hệ thống
- Xem lịch khám của mình
- Quản lý lịch làm việc
- Xem thông tin bệnh nhân
- Cập nhật hồ sơ bệnh án

### Cho Admin
- Quản lý tài khoản người dùng
- Quản lý thông tin bác sĩ
- Quản lý lịch khám
- Quản lý hồ sơ bệnh án
- Xem thống kê và báo cáo

## Công Nghệ Sử Dụng

### Backend
- Node.js
- Express.js
- MySQL (XAMPP)
- Sequelize ORM
- JWT Authentication
- Nodemailer (gửi email)
- Twilio (gửi SMS)

### Frontend
- React.js
- React Router
- Formik & Yup (form validation)
- Axios (HTTP client)
- Date-fns (xử lý ngày tháng)

## Cài Đặt

### Yêu Cầu Hệ Thống
- Node.js (v14 trở lên)
- XAMPP (MySQL)
- npm hoặc yarn

### Cài Đặt Backend
1. Clone repository
2. Di chuyển vào thư mục server:
   ```bash
   cd server
   ```
3. Cài đặt dependencies:
   ```bash
   npm install
   ```
4. Tạo file .env trong thư mục server với các biến môi trường:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=medical_appointment
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_token
   TWILIO_PHONE_NUMBER=your_twilio_phone
   ```
5. Khởi động XAMPP và tạo database
6. Chạy server:
   ```bash
   npm run dev
   ```

### Cài Đặt Frontend
1. Di chuyển vào thư mục client:
   ```bash
   cd client
   ```
2. Cài đặt dependencies:
   ```bash
   npm install
   ```
3. Chạy ứng dụng:
   ```bash
   npm start
   ```

## Cấu Trúc Thư Mục

```
medical-appointment-system/
├── client/                 # Frontend React
│   ├── public/
│   └── src/
│       ├── components/    # React components
│       ├── contexts/      # React contexts
│       ├── controllers/   # API controllers
│       ├── pages/         # Page components
│       └── App.js
├── server/                # Backend Node.js
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── server.js
└── README.md
```

## API Endpoints

### Authentication
- POST /api/auth/register - Đăng ký tài khoản
- POST /api/auth/login - Đăng nhập
- GET /api/auth/me - Lấy thông tin người dùng hiện tại

### Appointments
- GET /api/appointments - Lấy danh sách lịch khám
- POST /api/appointments - Tạo lịch khám mới
- GET /api/appointments/my-appointments - Lấy lịch khám của người dùng
- PUT /api/appointments/:id/status - Cập nhật trạng thái lịch khám

### Doctors
- GET /api/doctors - Lấy danh sách bác sĩ
- GET /api/doctors/:id - Lấy thông tin chi tiết bác sĩ
- GET /api/doctors/:id/schedules - Lấy lịch làm việc của bác sĩ

### Medical Records
- GET /api/medical-records - Lấy danh sách hồ sơ bệnh án
- POST /api/medical-records - Tạo hồ sơ bệnh án mới
- GET /api/medical-records/:id - Lấy chi tiết hồ sơ bệnh án

### Ratings
- POST /api/ratings - Tạo đánh giá mới
- GET /api/ratings/doctor/:id - Lấy đánh giá của bác sĩ
- GET /api/ratings/my-ratings - Lấy đánh giá của người dùng

## Đóng Góp

Mọi đóng góp đều được chào đón. Vui lòng:
1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## License

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết. 
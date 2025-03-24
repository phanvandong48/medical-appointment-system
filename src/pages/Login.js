import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Trong hàm xử lý đăng nhập của Login.js:
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Sau khi đăng nhập thành công, lưu thông tin người dùng vào localStorage
            const response = await axios.post('https://medical-appointment-api.onrender.com/api/auth/login', credentials);

            // Lưu token
            localStorage.setItem('token', response.data.token);

            // Lưu thông tin user
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // Chuyển hướng về trang chủ
            navigate('/');
        } catch (error) {
            // Xử lý lỗi
        }
    };

    return (
        <div className="login-container">
            <h2>Đăng nhập</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mật khẩu</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                </button>
            </form>
            <p>
                Chưa có tài khoản? <a onClick={() => navigate('/register')} style={{ cursor: 'pointer', color: '#4285f4' }}>Đăng ký ngay</a>
            </p>
        </div>
    );
};

export default Login; 
import axios from '../api/axios';

const handleSubmit = async (e) => {
    e.preventDefault();
    // ...

    try {
        const response = await axios.post(
            'https://medical-appointment-api.onrender.com/api/auth/register',
            userData
        );

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();
        console.log('Registration successful:', data);
        // Xử lý đăng ký thành công

    } catch (error) {
        console.error('Registration failed:', error);
        // Xử lý lỗi
    }
}; 
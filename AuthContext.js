const register = async (userData) => {
    try {
        // Đảm bảo gửi đúng định dạng dữ liệu mà API yêu cầu
        const response = await axios.post(`${API_URL}/auth/register`, userData, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        // Xử lý phản hồi
        if (response.data) {
            // Đăng ký thành công, có thể lưu token, cập nhật trạng thái, vv.
            return response.data;
        }
    } catch (error) {
        // Cải thiện xử lý lỗi
        console.error('Register error:', error.response?.data || error.message);
        throw error;
    }
}; 
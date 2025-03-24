// Hàm mô phỏng đăng nhập thành công
export const mockLogin = (credentials) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                token: 'fake_token_123456',
                user: {
                    id: '1',
                    name: 'Nguyễn Văn A',
                    email: credentials.email,
                    role: 'patient'
                }
            });
        }, 1000);
    });
};

// Sử dụng trong AuthContext
// Thay thế:
// const response = await api.post('/api/auth/login', credentials);
// Bằng:
// const response = { data: await mockLogin(credentials) }; 
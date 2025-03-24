import { useState, useEffect } from 'react';

// Custom hook để quản lý thông tin người dùng
export default function useUser() {
    const [user, setUser] = useState(null);

    // Tải thông tin người dùng từ localStorage khi hook được gọi
    useEffect(() => {
        try {
            const userData = localStorage.getItem('user');
            if (userData) {
                setUser(JSON.parse(userData));
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }

        // Đăng ký lắng nghe sự kiện cập nhật user
        const handleUserUpdate = (e) => {
            if (e.key === 'userUpdate') {
                try {
                    const userData = localStorage.getItem('user');
                    if (userData) {
                        setUser(JSON.parse(userData));
                    } else {
                        setUser(null);
                    }
                } catch (error) {
                    console.error('Error updating user data:', error);
                }
            }
        };

        window.addEventListener('storage', handleUserUpdate);
        document.addEventListener('userLoggedIn', () => {
            const userData = localStorage.getItem('user');
            if (userData) {
                setUser(JSON.parse(userData));
            }
        });
        document.addEventListener('userLoggedOut', () => {
            setUser(null);
        });

        return () => {
            window.removeEventListener('storage', handleUserUpdate);
            document.removeEventListener('userLoggedIn', handleUserUpdate);
            document.removeEventListener('userLoggedOut', handleUserUpdate);
        };
    }, []);

    return {
        user,
        isLoggedIn: !!user,

        // Hàm đăng nhập
        login: (userData) => {
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            // Kích hoạt sự kiện đăng nhập
            document.dispatchEvent(new Event('userLoggedIn'));
        },

        // Hàm đăng xuất
        logout: () => {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            setUser(null);
            // Kích hoạt sự kiện đăng xuất
            document.dispatchEvent(new Event('userLoggedOut'));
        }
    };
} 
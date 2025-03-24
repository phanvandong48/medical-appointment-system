import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

// Tạo context
const AuthContext = createContext();

// Custom hook để sử dụng AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kiểm tra trạng thái đăng nhập khi ứng dụng khởi động
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Hàm đăng nhập
  const login = async (credentials) => {
    try {
      // Sử dụng instance api đã cấu hình
      const response = await api.post('/api/auth/login', credentials);
      
      // Log để debug
      console.log('Login response:', response.data);
      
      if (response.data && response.data.token) {
        // Lưu token
        localStorage.setItem('token', response.data.token);
        
        // Lưu thông tin người dùng
        const userData = response.data.user;
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Cập nhật state
        setUser(userData);
        
        return userData;
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Hàm đăng ký
  const register = async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  // Hàm đăng xuất
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Giá trị context
  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 
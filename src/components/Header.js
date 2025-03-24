import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import '../App.css';
import { Link } from 'react-router-dom';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Log để debug
    console.log('Header rendering, user:', user);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        closeMenu();
        setIsDropdownOpen(false);
    };

    const handleNavigation = (path) => {
        navigate(path);
        window.scrollTo(0, 0);
        closeMenu();
        setIsDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isDropdownOpen && !event.target.closest('.user-dropdown')) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    return (
        <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container">
                <div className="header-wrapper">
                    <div className="logo">
                        <a onClick={() => handleNavigation('/')} style={{ cursor: 'pointer' }}>
                            <img src={logo} alt="Medical Appointment" />
                        </a>
                    </div>

                    <div className="hamburger-menu" onClick={toggleMenu}>
                        <div className={`hamburger-icon ${isMenuOpen ? 'open' : ''}`}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>

                    <nav className={`navigation ${isMenuOpen ? 'open' : ''}`}>
                        <ul>
                            <li>
                                <a
                                    onClick={() => handleNavigation('/')}
                                    className={window.location.pathname === '/' ? 'active' : ''}
                                    style={{ cursor: 'pointer' }}
                                >
                                    Trang chủ
                                </a>
                            </li>
                            <li>
                                <a
                                    onClick={() => handleNavigation('/services')}
                                    className={window.location.pathname === '/services' ? 'active' : ''}
                                    style={{ cursor: 'pointer' }}
                                >
                                    Dịch vụ
                                </a>
                            </li>
                            <li>
                                <a
                                    onClick={() => handleNavigation('/doctors')}
                                    className={window.location.pathname === '/doctors' ? 'active' : ''}
                                    style={{ cursor: 'pointer' }}
                                >
                                    Bác sĩ
                                </a>
                            </li>
                            <li>
                                <a
                                    onClick={() => handleNavigation('/about')}
                                    className={window.location.pathname === '/about' ? 'active' : ''}
                                    style={{ cursor: 'pointer' }}
                                >
                                    Giới thiệu
                                </a>
                            </li>
                            <li>
                                <a
                                    onClick={() => handleNavigation('/contact')}
                                    className={window.location.pathname === '/contact' ? 'active' : ''}
                                    style={{ cursor: 'pointer' }}
                                >
                                    Liên hệ
                                </a>
                            </li>

                            {user ? (
                                // Người dùng đã đăng nhập
                                <li className="user-dropdown">
                                    <a
                                        className="user-name"
                                        onClick={toggleDropdown}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {user.name} <i className="fas fa-chevron-down"></i>
                                    </a>

                                    {isDropdownOpen && (
                                        <ul className="dropdown-menu active">
                                            {user.role === 'patient' && (
                                                <>
                                                    <li><Link to="/book-appointment">Đặt lịch khám</Link></li>
                                                    <li><Link to="/my-appointments">Lịch khám của tôi</Link></li>
                                                    <li><Link to="/medical-records">Hồ sơ bệnh án</Link></li>
                                                </>
                                            )}

                                            {user.role === 'doctor' && (
                                                <>
                                                    <li><Link to="/doctor/dashboard">Dashboard</Link></li>
                                                    <li><Link to="/doctor/schedule">Quản lý lịch</Link></li>
                                                    <li><Link to="/doctor/medical-records">Hồ sơ bệnh nhân</Link></li>
                                                </>
                                            )}

                                            {user.role === 'admin' && (
                                                <>
                                                    <li><Link to="/admin/dashboard">Quản lý</Link></li>
                                                    <li><Link to="/admin/medical-records">Quản lý hồ sơ bệnh nhân</Link></li>
                                                </>
                                            )}
                                            <li>
                                                <button onClick={handleLogout} className="logout-btn">Đăng xuất</button>
                                            </li>
                                        </ul>
                                    )}
                                </li>
                            ) : (
                                // Người dùng chưa đăng nhập
                                <>
                                    <li>
                                        <a
                                            onClick={() => handleNavigation('/login')}
                                            className="login-btn"
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Đăng nhập
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            onClick={() => handleNavigation('/register')}
                                            className="register-btn"
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Đăng ký
                                        </a>
                                    </li>
                                </>
                            )}
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header; 
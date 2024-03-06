import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css'
import { useSelector } from 'react-redux'
import * as RiIcons from 'react-icons/ri';
const Header = () => {
    const authStatus = useSelector((state) => state.auth.status)
    const loggedInAccountType = useSelector((state) => state.auth.loggedInAccountType)
    const navigate = useNavigate();

    return (
        <header className="header">
            <nav >
                <div className="nav-logo">
                    <Link className="nav-link" to='/'><p>City E-Sewa</p></Link>
                </div>

                <ul >
                    <li>Home</li>
                    <li>About</li>
                    <li>Services</li>
                    <li>Notices</li>
                </ul>
                <div className="button-container">
                    <div className="dropdown">
                        <button className="dropdown-toggle"><RiIcons.RiMenu4Line /></button>
                        <div className="dropdown-content">
                            <Link className="nav-link" to='/'>Home</Link>
                            <Link className="nav-link" to='/about'>About</Link>
                            <Link className="nav-link" to='/services'>Services</Link>
                            <Link className="nav-link" to='/notices'>Notices</Link>
                        </div>
                    </div>
                    {
                        (!authStatus) ? <Link className="nav-link" to='/login'> <button className="login-button">Login</button></Link>
                            : (authStatus && loggedInAccountType === 'admin') ? <button className="login-button" onClick={() => navigate('/admin/dashboard')}>Dashboard</button>
                                : <button className="login-button" onClick={() => navigate('/dashboard')}>Dashboard</button>
                    }
                </div>
            </nav>
        </header>
    );
};

export default Header;

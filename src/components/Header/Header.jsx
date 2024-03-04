import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css'
import {useSelector} from 'react-redux'
const Header = () => {
    const authStatus = useSelector((state) => state.auth.status)
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
                        <button className="dropdown-toggle">...</button>
                        <div className="dropdown-content">
                            <Link className="nav-link" to='/'>Home</Link>
                            <Link className="nav-link" to='/about'>About</Link>
                            <Link className="nav-link" to='/services'>Services</Link>
                            <Link className="nav-link" to='/notices'>Notices</Link>
                        </div>
                    </div>
                   {authStatus===true ?  <button className="login-button"  onClick={() => navigate('/dashboard')}>Dashboard</button> : <Link className="nav-link" to='/login'> <button className="login-button">Login</button></Link>  }
                </div>
            </nav>
        </header>
    );
};

export default Header;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as CiIcons from 'react-icons/ci';
const Header = () => {
    const authStatus = useSelector((state) => state.auth.status);
    const loggedInAccountType = useSelector((state) => state.auth.loggedInAccountType);
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false); 

    const toggleMenu = () => {
        setShowMenu(!showMenu); 
    };

    return (
        <header>
            <nav className="w-full h-[80px] flex bg-slate-600 text-white justify-between items-center p-5">
                <div className="md:text-2xl text-lg font-bold">Municipal Hub</div>

                {/* Show the menu on larger screens */}
                <ul className="hidden md:flex flex-row">
                    <Link to="/"> <li className="mx-2 font-semibold cursor-pointer">Home</li></Link>
                    <Link to="/news" k><li className="mx-2 font-semibold cursor-pointer">News</li></Link>
                    <Link to="/notices"><li className="mx-2 font-semibold cursor-pointer">Notice</li></Link>
                    <Link to="/contact"><li className="mx-2 font-semibold cursor-pointer">Contact Us</li></Link>
                </ul>

                <div className="flex justify-center items-center">
                    {/* Toggle the menu on smaller screens */}
                    <CiIcons.CiMenuBurger
                        className="text-2xl md:hidden inline-block mr-4 cursor-pointer"
                        onClick={toggleMenu}
                    />

                    {/* Show the login/dashboard button */}
                    {!authStatus ? (
                        <Link to="/login">
                            <button className="bg-white text-slate-800 px-3 py-1 rounded">Login</button>
                        </Link>
                    ) : authStatus && loggedInAccountType === 'admin' ? (
                        <button onClick={() => navigate('/admin/dashboard')}>Dashboard</button>
                    ) : (
                        <button onClick={() => navigate('/dashboard')}>Dashboard</button>
                    )}
                </div>

                {/* Show the menu on smaller screens when toggled */}
                {showMenu && (
                    <ul className="md:hidden absolute top-[80px] left-0 w-full bg-slate-600 text-white">
                        <Link to="/"> <li className="mx-2 font-semibold cursor-pointer">Home</li></Link>
                        <Link to="/news" k><li className="mx-2 font-semibold cursor-pointer">News</li></Link>
                        <Link to="/notices"><li className="mx-2 font-semibold cursor-pointer">Notice</li></Link>
                        <Link to="/contact"><li className="mx-2 font-semibold cursor-pointer">Contact Us</li></Link>
                    </ul>
                )}
            </nav>
        </header>
    );
};

export default Header;
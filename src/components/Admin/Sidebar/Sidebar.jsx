
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import './Sidebar.css';
import { IconContext } from 'react-icons';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as MdIcons from 'react-icons/md';
import * as HiIcons from 'react-icons/hi';
import { baseUrl, apiPrefixV1 } from '../../../constants/AppConstants';
import { logout } from '../../../redux/slices/authSlice';
import { deleteDetails } from '../../../redux/slices/adminSlice';
import { toast } from 'react-toastify';
function Navbar() {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData)
  const username = useSelector((state) => state.admin.username)
  const [error, setError] = useState('')
  const handleLogout = async (event) => {
    event.preventDefault()
    try {
      const response = await axios.get(`${baseUrl}/${apiPrefixV1}/user/logout`, {
        headers: {
          Authorization: `Bearer ${userData['accessToken']}`
        }
      })
      const responseCode = response.data['code']
      if (responseCode === 2000 || responseCode === 2003 || responseCode === 2004) {
        dispatch(logout())
        dispatch(deleteDetails())
        toast.success("Logged out successfully!", { autoClose: true, position: 'top-right', pauseOnHover: false });
        navigate('/admin')

      }
      else {
        setError(response.data['message'])
        toast.error("Failed to logout!", { autoClose: true, position: 'top-right', pauseOnHover: false });

      }
    }
    catch (err) {
      setError(err.message)
      toast.error("Some error occurred!", { autoClose: true, position: 'top-right', pauseOnHover: false });

    }

  }


  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <div className='admin-navbar'>
          <div className="admin-nav-left">
            <Link to='#' className='menu-bars'>
              <FaIcons.FaBars onClick={showSidebar} />
            </Link>
            <Link to={'/admin/dashboard/'} className='left-admin-nav-link'><h3>Admin Dashboard</h3></Link>
          </div>
          <div className="admin-nav-right">
            <h3>{username ? username : ''}</h3>
              <button className='admin-nav-logout' onClick={handleLogout}>Logout</button>
          </div>
        </div>
        <nav className={sidebar ? 'admin-nav-menu active' : 'admin-nav-menu'}>
          <ul className='admin-nav-menu-items' onClick={showSidebar}>
            <li className='admin-nav-toggle'>
              <Link to='#' className='menu-bars'>
                <AiIcons.AiOutlineClose />
              </Link>
            </li>
            <li key={0} className='admin-nav-text'>
              <Link to={'/admin/dashboard/'}>
                <FaIcons.FaHome />
                <span>Home</span>
              </Link>
            </li>
            <li key={1} className='admin-nav-text'>
              <Link to={'/admin/dashboard/category'}>
                <MdIcons.MdCategory />
                <span>Category</span>
              </Link>
            </li>
            <li key={2} className='admin-nav-text'>
              <Link to={'/admin/dashboard/users'}>
                <FaIcons.FaUser />
                <span>Admins</span>
              </Link>
            </li>
            <li key={3} className='admin-nav-text'>
              <Link to={'/admin/dashboard/department'}>
                <HiIcons.HiOfficeBuilding />
                <span>Department</span>
              </Link>
            </li>
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default Navbar;

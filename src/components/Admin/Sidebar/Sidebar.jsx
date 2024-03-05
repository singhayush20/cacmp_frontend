
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
function Navbar() {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData)
  const [error, setError] = useState('')
  const handleLogout = async (event) => {
    event.preventDefault()
    try {
      const response = await axios.get(`${baseUrl}/${apiPrefixV1}/consumer/logout`, {
        headers: {
          Authorization: `Bearer ${userData['accessToken']}`
        }
      })
      console.log(response)
      const responseCode = response.data['code']
      if (responseCode === 2000 || responseCode === 2003 || responseCode === 2004) {
        dispatch(logout())
        dispatch(deleteDetails())
        console.log('logging out')
        navigate('/admin')
      }
      else {
        setError(response.data['message'])
      }
    }
    catch (err) {
      setError(err.message)
      console.log(err)
    }
  }


  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <div className='navbar'>
          <div className="left">
            <Link to='#' className='menu-bars'>
              <FaIcons.FaBars onClick={showSidebar} />
            </Link>
            <Link to={'/admin/dashboard/'} className='nav-link'><h1>Admin Dashboard</h1></Link>
          </div>
          <Link to='#' className='menu-bars'>
            <button className='logout' onClick={handleLogout}>Logout</button>
          </Link>
        </div>
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className='nav-menu-items' onClick={showSidebar}>
            <li className='navbar-toggle'>
              <Link to='#' className='menu-bars'>
                <AiIcons.AiOutlineClose />
              </Link>
            </li>
            <li key={0} className='nav-text'>
              <Link to={'/admin/dashboard/'}>
                <FaIcons.FaHome />
                <span>Home</span>
              </Link>
            </li>
            <li key={1} className='nav-text'>
              <Link to={'/admin/dashboard/category'}>
                <MdIcons.MdCategory />
                <span>Category</span>
              </Link>
            </li>
            <li key={2} className='nav-text'>
              <Link to={'/admin/dashboard/users'}>
                <FaIcons.FaUser />
                <span>Admins</span>
              </Link>
            </li>
            <li key={3} className='nav-text'>
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

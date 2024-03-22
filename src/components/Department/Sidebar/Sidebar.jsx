import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import { IconContext } from 'react-icons';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as Io5Icons from 'react-icons/io5'
import * as GrIcons from 'react-icons/gr'
function Navbar({departmentName, handleLogout}) {
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);




  return (
    <>

      <IconContext.Provider value={{ color: '#fff' }}>
        <div className='navbar'>
          <div className="nav-left">
            <Link to='#' className='menu-bars'>
              <FaIcons.FaBars onClick={showSidebar} />
            </Link>
            <Link to={'/dashboard'} className='left-nav-link'><h3>Admin Dashboard</h3></Link>
          </div>
          <div className="nav-right">
            <h3>{departmentName ? departmentName : ''}</h3>
            <Link to='#' className='menu-bars'>
              <button className='logout' onClick={handleLogout}>Logout</button>
            </Link>
          </div>
        </div>
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className='nav-menu-items' onClick={showSidebar}>
            <li className='navbar-toggle'>
              <Link to='#' className='menu-bars'>
                <AiIcons.AiOutlineClose />
              </Link>
            </li>
            <li key={0} className='nav-text'>
              <Link to={'/dashboard'}>
                <FaIcons.FaHome />
                <span>Categories</span>
              </Link>
            </li>
            <li key={1} className='nav-text'>
              <Link to={'/dashboard/poll'}>
                <FaIcons.FaPoll/>
                <span>Poll</span>
              </Link>
            </li>
            <li key={2} className='nav-text'>
              <Link to={'/dashboard/notice'}>
                <Io5Icons.IoDocument />
                <span>Notice</span>
              </Link>
            </li>
            <li key={3} className='nav-text'>
              <Link to={'/dashboard/article'}>
                <GrIcons.GrArticle />
                <span>Articles</span>
              </Link>
            </li>
          
          </ul>
        </nav>
      </IconContext.Provider>

    </>
  );
}

export default Navbar;

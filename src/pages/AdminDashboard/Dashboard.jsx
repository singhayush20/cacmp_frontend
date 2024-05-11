// AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Admin/Sidebar/Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { saveDetails } from '../../redux/slices/adminSlice';
import axios from 'axios';
import { baseUrl, apiPrefixV1 } from '../../constants/AppConstants';
import { toast } from 'react-toastify'
import { logout } from '../../redux/slices/authSlice';
import LoadingIndicator2 from '../../components/LoadingIndicator2/LoadingIndicator2';
import { green } from '@mui/material/colors';
const AdminDashboard = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    loadUserData()
  }, [])


  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userData.accessToken}`,
        }
      }
      const response = await axios.get(`${baseUrl}/${apiPrefixV1}/user/${userData['token']}`, config)
      const code = response.data['code']
      if (code === 2000) {
        dispatch(saveDetails(response.data['data']))
      }
      else if (code === 2003) {
        dispatch(logout())
        navigate('/login')
        toast.info("Login again", { autoClose: true, position: 'top-right', pauseOnHover: false });

      }
      else {
        toast.error("Error occurred while loading data!", { autoClose: true, position: 'top-right', pauseOnHover: false });

      }
    }
    catch (err) {
      console.log(err.message)
    }
    setIsLoading(false);
  }

  if (isLoading) {
    return (
      <div className='w-full h-screen flex justify-center items-center'>
         <LoadingIndicator2 color={"#1b5e20"} size={50}/>
      </div>
    )
  }
  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;

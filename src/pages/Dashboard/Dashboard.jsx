// AdminDashboard.js
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Admin/Sidebar/Sidebar';
import { useDispatch,useSelector } from 'react-redux';
import { saveDetails } from '../../redux/slices/adminSlice';
import axios from 'axios';
import { baseUrl, apiPrefixV1 } from '../../constants/AppConstants';
const AdminDashboard = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    loadUserData()
  },[])


  const loadUserData = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userData.accessToken}`,
        }
      }
      const response=await axios.get(`${baseUrl}/${apiPrefixV1}/user/${userData['token']}`,config)
      const code = response.data['code']
      if(code===2000){
        dispatch(saveDetails(response.data['data']))
      }
      else if(code===2003){
        dispatch(logout())
        navigate('/login')
      }
      else{
        console.log('some error occurred: ', response.data.message);
      }
    }
    catch(err){
      console.log(err.message)
    }
  }
  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="main-content">
        <Outlet/>
      </div>
    </div>
  );
};

export default AdminDashboard;

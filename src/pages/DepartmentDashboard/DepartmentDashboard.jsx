import React, { useEffect, useState } from 'react'
import './DepartmentDashboard.css'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios';
import { baseUrl, apiPrefixV1 } from '../../constants/AppConstants';
import { useNavigate, Outlet } from 'react-router-dom';
import { saveDetails, deleteDetails } from '../../redux/slices/departmentSlice';
import { logout } from '../../redux/slices/authSlice';
import { toast } from "react-toastify";
import Navbar from '../../components/Department/Sidebar/Sidebar';
import LoadingIndicator2 from '../../components/LoadingIndicator2/LoadingIndicator2';
function DepartmentDashboard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector(state => state.auth.userData);
    const departmentName = useSelector(state => state.department.name)
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        loadDepartmentData();
    }, [])



    const loadDepartmentData = async () => {
        setIsLoading(true)
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userData.accessToken}`,
                },
            };
            const response = await axios.get(`${baseUrl}/${apiPrefixV1}/department/${userData['token']}`, config);
            const code = response.data['code']
            if (code === 2000) {
                dispatch(saveDetails(response.data['data']));
                setIsLoading(false)
            }
            else if (code === 2003) {
                dispatch(logout())
                toast.info("Login again!", { autoClose: true, position: 'top-right', pauseOnHover: false });
                navigate('/login')
            }
            else {
                toast.error("Failed to load details", { autoClose: true, position: 'top-right', pauseOnHover: false });
            }
        } catch (error) {
            toast.error("Some error occurred!", { autoClose: true, position: 'top-right', pauseOnHover: false });
        }
    }

    const handleLogout = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${userData.accessToken}`,
            },
        };
        try {

            const response = await axios.get(`${baseUrl}/${apiPrefixV1}/department/logout`, config)
            const code = response.data['code']
            if (code === 2000 || code === 2003 || code === 2004) {
                dispatch(deleteDetails())
                dispatch(logout())
                toast.success("Logged out successfully!", { autoClose: true, position: 'top-right', pauseOnHover: false });
                navigate('/')
            }
            else {
                toast.error("Failed to logout!", { autoClose: true, position: 'top-right', pauseOnHover: false });
            }

        }
        catch (err) {
            toast.error("Failed to logout!", { autoClose: true, position: 'top-right', pauseOnHover: false });
        }
    }

    return (
        <div className="department-dashboard">
        {isLoading ? (
          <div className="loading"><LoadingIndicator2 color="#36d7b7" size={50} /></div>
        ) : (
          <>
            <Navbar departmentName={departmentName} handleLogout={handleLogout}/>
            <Outlet />
          </>
        )}
      </div>
      
      
    )
}

export default DepartmentDashboard


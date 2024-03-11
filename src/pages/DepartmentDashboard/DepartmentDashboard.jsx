import React, { useEffect } from 'react'
import './DepartmentDashboard.css'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios';
import { baseUrl, apiPrefixV1 } from '../../constants/AppConstants';
import { useNavigate, Outlet } from 'react-router-dom';
import { saveDetails, deleteDetails } from '../../redux/slices/departmentSlice';
import { logout } from '../../redux/slices/authSlice';
import { toast } from "react-toastify";
function DepartmentDashboard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector(state => state.auth.userData);
    const departmentName = useSelector(state => state.department.name)
    useEffect(() => {
        loadDepartmentData();
    }, [])



    const loadDepartmentData = async () => {

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
            }
            else if (code === 2003) {
                dispatch(logout())
                toast.info("Login again!", { autoClose: true, position: 'top-right', pauseOnHover: false });
                navigate('/admin')
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
        <div className="dashboard">
            <nav className="navbar">
                <div className="left">
                    <div className='heading'>{departmentName ? departmentName : 'E-Seva Dashboard'}</div>
                </div>
                <div className="right">
                    <div className="btns">
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </nav>
            <Outlet />

        </div>
    )
}

export default DepartmentDashboard
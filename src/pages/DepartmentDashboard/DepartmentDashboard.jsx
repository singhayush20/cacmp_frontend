import React, { useEffect } from 'react'
import './DepartmentDashboard.css'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios';
import { baseUrl, apiPrefixV1 } from '../../constants/AppConstants';
import { useNavigate } from 'react-router-dom';
import { saveDetails, deleteDetails } from '../../redux/slices/departmentSlice';
import { logout } from '../../redux/slices/authSlice';
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
            const response = await axios.get(`${baseUrl}/${apiPrefixV1}/department/details/${userData['token']}`, config);
            const code = response.data['code']
            console.log(response.data)
            if (code === 2000) {
                console.log('saving data...')
                dispatch(saveDetails(response.data['data']));
            }
            else if (code === 2003) {
                console.log('token expired!');
                dispatch(logout())
                navigate('/login')
            }
        }
        catch (err) {
            console.log(err.message)
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
            console.log(response)
            const code = response.data['code']
            if (code === 2000 || code === 2003 || code === 2004) {
                dispatch(deleteDetails())
                dispatch(logout())
                navigate('/')
            }
        
        }
        catch (err) {
            console.log(err.message)
        }
    }

    return (
        <div className="dashboard">
            <nav className="navbar">
                <h1>{departmentName ? departmentName : 'E-Seva Dashboard'}</h1>
                <div className="btns">
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </nav>
        </div>
    )
}

export default DepartmentDashboard
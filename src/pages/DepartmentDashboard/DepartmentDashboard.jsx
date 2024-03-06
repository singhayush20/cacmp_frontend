import React, { useEffect } from 'react'
import './DepartmentDashboard.css'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios';
import { baseUrl, apiPrefixV1 } from '../../constants/AppConstants';
import { useNavigate } from 'react-router-dom';
import { saveDetails, deleteDetails } from '../../redux/slices/departmentSlice';
import { logout } from '../../redux/slices/authSlice';
import { useState } from 'react';
import { Link } from 'react-router-dom';
function DepartmentDashboard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector(state => state.auth.userData);
    const departmentName = useSelector(state => state.department.name)
    const departmentObjective = useSelector(state => state.department.objective)
    const [categories,setCategories]=useState([])
    useEffect(() => {
        loadDepartmentData();
        loadCategories();
    }, [])

    const loadCategories=async()=>{
        const config = {
            headers: {
                Authorization: `Bearer ${userData.accessToken}`,
            },
        }

        try {
            const response = await axios.get(`${baseUrl}/${apiPrefixV1}/category/all?departmentToken=${userData['token']}`, config);
            const code = response.data['code']
            if(code===2000){
                setCategories(response.data['data'])
            }
            else if(code===2003){
                console.log('token expired!');
                dispatch(logout())
                navigate('/login')          
            }
        }
        catch(err){
            console.log(err.message)
        }
    }

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
                <div className="left">
                    <div className='heading'>{departmentName ? departmentName : 'E-Seva Dashboard'}</div>
                </div>
                <div className="right">
                    <div className="btns">
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </nav>

            <div className="main-content">
                <div className="aim">
                    {departmentObjective ? <h3 >Aim of the department</h3> : null}
                    {departmentObjective ? <div>{departmentObjective}</div> : null}
                </div>
                <div className="category-component">
                    <h2>Category List</h2>
                    {
                        (categories.length !== 0) ?
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.map((category) => (
                                            <tr key={category.categoryToken}>

                                                <td>
                                                    <Link className="category-link" to={`/dashboard/category/${category.categoryToken}`}>{category.categoryName}</Link>
                                                </td>
                                                <td>{category.categoryDescription}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            :
                            <div className="no-data">
                                <p>No categories</p>
                            </div>
                    }

                </div>
            </div>
        </div>
    )
}

export default DepartmentDashboard
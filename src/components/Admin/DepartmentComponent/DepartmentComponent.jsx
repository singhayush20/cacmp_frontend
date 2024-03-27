import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { baseUrl, apiPrefixV1 } from '../../../constants/AppConstants';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { logout } from '../../../redux/slices/authSlice';
import { useDispatch } from 'react-redux';
function DepartmentComponent() {
    const [departments, setUsers] = useState([]);
    const userData = useSelector((state) => state.auth.userData);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loadDeptData = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${userData.accessToken}`,
            },
        };

        try {
            const response = await axios.get(`${baseUrl}/${apiPrefixV1}/department/all`, config);
            const code = response.data.code;
            if (code === 2000) {
                setUsers(response.data.data);
            } else if (code === 2003) {
                dispatch(logout())
                toast.info("Login again!", { autoClose: true, position: 'top-right', pauseOnHover: false });
                navigate('/admin')
            }
            else {
                toast.error("Failed to load data!", { autoClose: true, position: 'top-right', pauseOnHover: false });

            }
        } catch (error) {
            toast.error("Some error occurred!", { autoClose: true, position: 'top-right', pauseOnHover: false });
        }
    };

    useEffect(() => {
        loadDeptData();
    }, []);

    const handleDeleteDepartment = async (deptToken) => {
        try {
            const response = await axios.delete(`${baseUrl}/${apiPrefixV1}/department/${deptToken}`, {
                headers: {
                    Authorization: `Bearer ${userData.accessToken}`,
                },
            });
            const code = response.data.code;
            if (code === 2000) {
                setUsers(departments.filter(user => user.deptToken !== deptToken));
            } else if (code === 2003) {
                dispatch(logout())
                toast.info("Login again!", { autoClose: true, position: 'top-right', pauseOnHover: false });
                navigate('/admin')
            }
            else if (code === 2003) {
                toast.error("You do not have permission to delete the department!", { autoClose: true, position: 'top-right', pauseOnHover: false });
            }
            else {
                toast.error("Failed to delete!", { autoClose: true, position: 'top-right', pauseOnHover: false });
            }
        } catch (error) {
            toast.error("Some error occurred!", { autoClose: true, position: 'top-right', pauseOnHover: false });
        }
    };

    return (
        <div className="user-component">
            <div className="admin-add-btn">
                <button onClick={() => { navigate('/admin/dashboard/department/new') }}>New department account</button>
            </div>
            <h2>Deparment Accounts</h2>
            <div className="table-container">
                {
                    (departments.length !== 0) ?
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Username</th>
                                    <th>Objective</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {departments.map((department) => (
                                    <tr key={department.deptToken}>
                                        <td>{department.departmentName}</td>
                                        <td>
                                            <Link className="user-link" to={`/admin/dashboard/department/${department.deptToken}`}>{department.username}</Link>
                                        </td>
                                        <td>{department.departmentObjective}</td>
                                        <td>
                                            <button className='admin-delete-btn' onClick={() => handleDeleteDepartment(department.deptToken)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        :
                        <div className="no-data">
                            <p>No department found</p>
                        </div>
                }
            </div>
        </div>
    );
}

export default DepartmentComponent;

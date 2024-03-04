import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { baseUrl, apiPrefixV1 } from '../../constants/AppConstants';
import './DepartmentComponent.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
function DepartmentComponent() {
    const [departments, setUsers] = useState([]);
    const userData = useSelector((state) => state.auth.userData);
    const navigate=useNavigate();
    const loadUsers = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${userData.accessToken}`,
            },
        };

        try {
            const response = await axios.get(`${baseUrl}/${apiPrefixV1}/department/all`, config);
            const code = response.data.code;
            console.log(response.data);
            if (code === 2000) {
                setUsers(response.data.data);
            } else if (code === 2003) {
                console.log('token expired!');
                navigate('/login')
            }
        } catch (error) {
            console.error('Error loading users:', error);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleDeleteDepartment = async (userId) => {
        try {
            const response = await axios.delete(`${baseUrl}/${apiPrefixV1}/department/${userId}`, {
                headers: {
                    Authorization: `Bearer ${userData.accessToken}`,
                },
            });
            const code = response.data.code;
            if (code === 2000) {
                // Remove the deleted user from the list
                setUsers(departments.filter(user => user.userToken !== userId));
            } else if (code === 2003) {
                console.log('token expired!');
            } else {
                console.log('Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <div className="user-component">
            <div className="buttons">
                <button onClick={()=>{navigate('/dashboard/department/new')}}>New department account</button>
            </div>
            <h2>User List</h2>
            <div className="table-container">
               {
                (departments.length!==0) ? 
                <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Name</th>
                        <th>Roles</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {departments.map((department) => (
                        <tr key={department.userToken}>
                            <td>
                                <Link className="user-link" to={`/dashboard/department/${department.departmentToken}`}>{department.username}</Link>
                            </td>
                            <td>{department.name}</td>
                            <td>
                                {department.roles.map((role, index) => (
                                    <span key={index}>
                                        {role === 'ROLE_DEPARTMENT' ? 'department admin' : 'department admin'}
                                    </span>
                                ))}
                            </td>
                            <td>
                                <button className='delete-btn' onClick={() => handleDeleteDepartment(department.userToken)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            :
            <p>No department found</p>
               }
            </div>
        </div>
    );
}

export default DepartmentComponent;

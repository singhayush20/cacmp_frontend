import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { baseUrl, apiPrefixV1 } from '../../../constants/AppConstants';
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
                navigate('/admin')
            }
        } catch (error) {
            console.error('Error loading users:', error);
        }
    };

    useEffect(() => {
        loadUsers();
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
                console.log('token expired!');
            } else {
                console.log('Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error.message);
        }
    };

    return (
        <div className="user-component">
            <div className="buttons">
                <button onClick={()=>{navigate('/admin/dashboard/department/new')}}>New department account</button>
            </div>
            <h2>Deparment Accounts</h2>
            <div className="table-container">
               {
                (departments.length!==0) ? 
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
                                <button className='delete-btn' onClick={() => handleDeleteDepartment(department.deptToken)}>Delete</button>
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

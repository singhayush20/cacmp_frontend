import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { baseUrl, apiPrefixV1 } from '../../constants/AppConstants';
import './UserComponent.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
function UsersComponent() {
    const [users, setUsers] = useState([]);
    const userData = useSelector((state) => state.auth.userData);
    const navigate=useNavigate();
    const loadUsers = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${userData.accessToken}`,
            },
        };

        try {
            const response = await axios.get(`${baseUrl}/${apiPrefixV1}/user/all`, config);
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

    const handleDeleteUser = async (userId) => {
        try {
            const response = await axios.delete(`${baseUrl}/${apiPrefixV1}/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${userData.accessToken}`,
                },
            });
            const code = response.data.code;
            if (code === 2000) {
                // Remove the deleted user from the list
                setUsers(users.filter(user => user.userToken !== userId));
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
                <button onClick={()=>{navigate('/dashboard/users/new')}}>Add a new user</button>
            </div>
            <h2>User List</h2>
            <div className="table-container">
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
                        {users.map((user) => (
                            <tr key={user.userToken}>
                                <td>
                                    <Link className="user-link" to={`/dashboard/users/${user.userToken}`}>{user.username}</Link>
                                </td>
                                <td>{user.name}</td>
                                <td>
                                    {user.roles.map((role, index) => (
                                        <span key={index}>
                                            {role === 'ROLE_ADMIN' ? 'Root admin' : 'admin'}
                                        </span>
                                    ))}
                                </td>
                                <td>
                                    <button className='delete-btn' onClick={() => handleDeleteUser(user.userToken)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UsersComponent;

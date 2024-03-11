import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { baseUrl, apiPrefixV1 } from '../../../constants/AppConstants';
import './UserComponent.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { logout } from '../../../redux/slices/authSlice';
function UsersComponent() {
    const [users, setUsers] = useState([]);
    const userData = useSelector((state) => state.auth.userData);
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const loadUsers = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${userData.accessToken}`,
            },
        };

        try {
            const response = await axios.get(`${baseUrl}/${apiPrefixV1}/user/all`, config);
            const code = response.data.code;
            if (code === 2000) {
                setUsers(response.data.data);
            } else if (code === 2003) {
                console.log('token expired!');
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
                dispatch(logout())
                toast.info("Login again!", { autoClose: true, position: 'top-right', pauseOnHover: false });
                navigate('/admin')
            }
            else if (code === 2001) {
                toast.error("You do not have permission to delete the user!", { autoClose: true, position: 'top-right', pauseOnHover: false });
            }
            else {
                toast.error("Failed to load data", { autoClose: true, position: 'top-right', pauseOnHover: false });

            }
        } catch (error) {
            toast.error("Some error occurred!", { autoClose: true, position: 'top-right', pauseOnHover: false });
        }
    };

    return (
        <div className="user-component">
            <div className="buttons">
                <button onClick={() => { navigate('/admin/dashboard/users/new') }}>Add a new user</button>
            </div>
            <h2>Admin List</h2>
            {
                (users.length !== 0) ?
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
                                            <Link className="user-link" to={`/admin/dashboard/users/${user.userToken}`}>{user.username}</Link>
                                        </td>
                                        <td>{user.name}</td>
                                        <td>
                                            {user.roles.map((role, index) => (
                                                <span key={index}>
                                                    {role === 'ROLE_ROOT_ADMIN' ? 'Root Admin' : 'Sub Admin'}
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
                    :
                    <div className="no-data">
                        <p>No admin users</p>
                    </div>
            }

        </div>
    );
}

export default UsersComponent;

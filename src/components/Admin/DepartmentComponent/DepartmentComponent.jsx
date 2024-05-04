import { useState, useEffect } from 'react';
import axios from "axios";
import { baseUrl, apiPrefixV1 } from '../../../constants/AppConstants';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { logout } from '../../../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';

function DepartmentComponent() {
    const [departments, setDepartments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [selectedDepartmentToken, setSelectedDepartmentToken] = useState('');
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
                setDepartments(response.data.data);
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
        const config = {
            headers: {
                Authorization: `Bearer ${userData.accessToken}`,
            },
        };

        try {
            const response = await axios.delete(`${baseUrl}/${apiPrefixV1}/department/${deptToken}`, config);
            const code = response.data.code;
            if (code === 2000) {
                setDepartments(departments.filter(department => department.deptToken !== deptToken));
            } else if (code === 2003) {
                dispatch(logout())
                toast.info("Login again!", { autoClose: true, position: 'top-right', pauseOnHover: false });
                navigate('/admin')
            }
            else if (code === 2001) {
                toast.error("You do not have permission to delete the department!", { autoClose: true, position: 'top-right', pauseOnHover: false });
            }
            else {
                toast.error(`Failed to delete: ${response.data.data}`, { autoClose: true, position: 'top-right', pauseOnHover: false });
            }
        } catch (error) {
            toast.error("Some error occurred!", { autoClose: true, position: 'top-right', pauseOnHover: false });
        }
    };

    const handleOpenModal = (deptToken) => {
        setSelectedDepartmentToken(deptToken);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setNewPassword('');
        setConfirmPassword('');
        setSelectedDepartmentToken('');
    };

    const handleSavePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match", { autoClose: true, position: 'top-right', pauseOnHover: false });
            return;
        }
        try {
            const response = await axios.post(`${baseUrl}/${apiPrefixV1}/department/password/change`, {
                departmentToken: selectedDepartmentToken,
                password: newPassword
            }, {
                headers: {
                    Authorization: `Bearer ${userData.accessToken}`,
                },
            });

            const code = response.data.code;
            if (code === 2000) {
                toast.success("Password changed successfully", { autoClose: true, position: 'top-right', pauseOnHover: false });
                handleCloseModal();
            } else if (code === 2003) {
                dispatch(logout())
                toast.info("Login again!", { autoClose: true, position: 'top-right', pauseOnHover: false });
                navigate('/admin')
            }
            else {
                toast.error(`Failed to change password: ${response.data.data}`, { autoClose: true, position: 'top-right', pauseOnHover: false });
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
            <h2>Department Accounts</h2>
            <div className="table-container">
                {
                    departments.length !== 0 ?
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Username</th>
                                    <th>Objective</th>
                                    <th>Password</th>
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
                                            <button className='admin-delete-btn' onClick={() => handleOpenModal(department.deptToken)}>Change Password</button>
                                        </td>
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
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full">
                        <button className="absolute top-0 right-0 mt-2 mr-2 text-gray-500 hover:text-black" onClick={handleCloseModal}>
                            &times;
                        </button>
                        <h2 className="text-xl font-bold mb-4">Change Password</h2>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="block w-full border border-gray-300 rounded-md py-2 px-3 mb-4 focus:outline-none focus:border-blue-500"
                            placeholder="New Password"
                        />
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="block w-full border border-gray-300 rounded-md py-2 px-3 mb-4 focus:outline-none focus:border-blue-500"
                            placeholder="Confirm Password"
                        />
                        <div className="flex justify-center items-center">
                            <button
                                onClick={handleSavePasswordChange}
                                className="bg-green-700 mr-2 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:bg-blue-600"
                            >
                                Save
                            </button>
                            <button
                                onClick={handleCloseModal}
                                className="bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:bg-blue-600"
                            >
                                Close
                            </button>
                        </div>

                    </div>
                </div>

            )}
        </div>
    );
}

export default DepartmentComponent;

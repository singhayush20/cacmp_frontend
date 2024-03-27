import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { baseUrl, apiPrefixV1 } from '../../../constants/AppConstants';
import { logout } from '../../../redux/slices/authSlice';
import * as FaIcons from 'react-icons/fa';
import { toast } from 'react-toastify';
function DepartmentDetailsComponent() {
    const userData = useSelector(state => state.auth.userData);
    const { departmentToken } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [deptInfo, setDepartmentInfo] = useState({
        departmentName: '',
        username: '',
        departmentObjective: '',
    });
    const [loading, setLoading] = useState(true);
    const [formErrors, setFormErrors] = useState({});

    const loadDepartmentData = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userData.accessToken}`
                }
            };
            const response = await axios.get(`${baseUrl}/${apiPrefixV1}/department/${departmentToken}`, config);
            const code = response.data.code;
            if (code === 2000) {
                setLoading(false)
                const { departmentName, departmentObjective, username } = response.data.data;
                setDepartmentInfo({ departmentName, departmentObjective, username });
            } else if (code === 2003) {
                dispatch(logout())
                toast.info("Login again!", { autoClose: true, position: 'top-right', pauseOnHover: false });
                navigate('/admin')
            }
            else {
                toast.error("Failed to load details", { autoClose: true, position: 'top-right', pauseOnHover: false });
            }
        } catch (error) {
            console.log(error.message)
            toast.error("Some error occurred!", { autoClose: true, position: 'top-right', pauseOnHover: false });
        }
    };

    useEffect(() => {
        loadDepartmentData();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (validateForm()) {
            try {
                const data = {
                    deptToken: departmentToken,
                    username: deptInfo.username,
                    departmentName: deptInfo.departmentName,
                    departmentObjective: deptInfo.departmentObjective
                }
                const response = await axios.put(`${baseUrl}/${apiPrefixV1}/department`, data, {
                    headers: {
                        Authorization: `Bearer ${userData.accessToken}`
                    }
                })
                const code = response.data.code
                if (code === 2000) {
                    navigate('/admin/dashboard/department')
                }
                else if (code === 2003) {
                    dispatch(logout())
                    toast.info("Login again!", { autoClose: true, position: 'top-right', pauseOnHover: false });
                    navigate('/admin')
                }
                else if (code === 2001) {
                    toast.error("You do not have permission to update department details!", { autoClose: true, position: 'top-right', pauseOnHover: false });
                }
                else {
                    toast.error("Failed to update details", { autoClose: true, position: 'top-right', pauseOnHover: false });
                }
            } catch (error) {
                toast.error("Some error occurred!", { autoClose: true, position: 'top-right', pauseOnHover: false });
            }
        }
    };

    const handleBack = () => {
        navigate('/admin/dashboard/department');
    };

    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (!deptInfo.departmentName.trim()) {
            errors.departmentName = 'Name is required';
            isValid = false;
        }

        if (!deptInfo.username.trim()) {
            errors.username = 'Username is required';
            isValid = false;
        }

        if (!deptInfo.departmentObjective.trim()) {
            errors.departmentObjective = 'Objective is required';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="user-details-container">
            <div className="back-button" onClick={handleBack}>
                <FaIcons.FaArrowLeft />
            </div>
            <div className="user-details-form">
                <h2>Edit Department Details</h2>
                <form onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label htmlFor="name">Department Name:</label>
                        <input
                            type="text"
                            id="name"
                            value={deptInfo.departmentName}
                            className={formErrors.username ? 'invalid' : ''}
                            onChange={(e) => setDepartmentInfo({ ...deptInfo, departmentName: e.target.value })}
                        />
                        {formErrors.departmentName && <span className="error-message">{formErrors.departmentName}</span>}
                    </div>

                    <div className='form-group'>
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={deptInfo.username}
                            className={formErrors.username ? 'invalid' : ''}
                            onChange={(e) => setDepartmentInfo({ ...deptInfo, username: e.target.value })}
                        />
                        {formErrors.username && <span className="error-message">{formErrors.username}</span>}
                    </div>

                    <div className='form-group'>
                        <label htmlFor="username">Objective:</label>
                        <input
                            type="text"
                            id="username"
                            value={deptInfo.departmentObjective}
                            className={formErrors.departmentObjective ? 'invalid' : ''}
                            onChange={(e) => setDepartmentInfo({ ...deptInfo, departmentObjective: e.target.value })}
                        />
                        {formErrors.departmentObjective && <span className="error-message">{formErrors.departmentObjective}</span>}
                    </div>

                    <button type="submit" className='admin-submit-button'>Save</button>
                </form>
            </div>
        </div>
    );
}

export default DepartmentDetailsComponent;

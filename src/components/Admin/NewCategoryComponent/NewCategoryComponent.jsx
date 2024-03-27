import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import './NewCategoryComponent.css';
import { useSelector, useDispatch } from 'react-redux';
import { baseUrl, apiPrefixV1 } from '../../../constants/AppConstants';
import { logout } from '../../../redux/slices/authSlice';
import {toast} from "react-toastify";
function NewCategoryComponent() {
    const userData = useSelector(state => state.auth.userData);
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const loadDepartments = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userData.accessToken}`
                }
            }
            const response = await axios.get(`${baseUrl}/${apiPrefixV1}/department/names`, config);
            const code = response.data.code;
            if (code === 2000) {
                const data = response.data['data'];
                setDepartments(data);
            }
            else if (code === 2003) {
                dispatch(logout())
                navigate('/admin/login')
            }
            else {
                console.log('some error occurred: ', response.data.message);
            }
        }
        catch (err) {
            console.log(err.message);
        }
    }

    useEffect(() => {
        loadDepartments();
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (validateForm()) {
            try {
                const response = await axios.post(`${baseUrl}/${apiPrefixV1}/category/new`, {
                    categoryName: categoryName,
                    categoryDescription: categoryDescription,
                    departmentToken: selectedDepartment
                }, {
                    headers: {
                        Authorization: `Bearer ${userData.accessToken}`
                    }
                });
                // Handle successful response
                const code = response.data.code;
                if (code === 2000) {
                    toast.success("Category created successfully!", { autoClose: true, position: 'top-right', pauseOnHover: false });
                    navigate('/admin/dashboard/category');
                }
                else if (code === 2003) {
                    dispatch(logout())
                    toast.info("Login again!", { autoClose: true, position: 'top-right', pauseOnHover: false });
                    navigate('/admin')
                }
                else if (code === 2001) {
                    toast.error("You do not have permission to create the category!", { autoClose: true, position: 'top-right', pauseOnHover: false });
                }
                else {
                    toast.error("Failed to create categrory", { autoClose: true, position: 'top-right', pauseOnHover: false });

                }
            } catch (error) {
                toast.error("Some error occurred!", { autoClose: true, position: 'top-right', pauseOnHover: false });
            }
        }
    };

    const handleBack = () => {
        navigate('/admin/dashboard/category');
    };

    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (!categoryName.trim()) {
            errors.categoryName = 'Name is required';
            isValid = false;
        }

        if (!categoryDescription.trim()) {
            errors.categoryDescription = 'Description is required';
            isValid = false;
        }

        if (!selectedDepartment.trim()) {
            errors.selectedDepartment = 'Department is required';
            isValid = false;

        }

        setFormErrors(errors);
        return isValid;
    };

    return (
        <div className="new-user-container">
            <div className="back-button" onClick={handleBack}>
                <FaIcons.FaArrowLeft />
            </div>
            <div className="new-user-form">
                <h2>Create New Category</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="categoryName">Category Name:</label>
                        <input
                            type="text"
                            id="categoryName"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            className={formErrors.categoryName ? 'invalid' : ''}
                        />
                        {formErrors.categoryName && <span className="error-message">{formErrors.categoryName}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="name">Description:</label>
                        <input
                            type="text"
                            id="name"
                            value={categoryDescription}
                            onChange={(e) => setCategoryDescription(e.target.value)}
                            className={formErrors.categoryDescription ? 'invalid' : ''}
                        />
                        {formErrors.categoryDescription && <span className="error-message">{formErrors.categoryDescription}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="department">Department:</label>
                        <select
                            id="department"
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            className={formErrors.selectedDepartment ? 'invalid' : ''}
                        >
                            <option value="">Select Department</option>
                            {
                                departments.map((department) => (
                                    <option key={department.departmentToken} value={department.departmentToken}>{department.departmentName}</option>
                                ))
                            }
                        </select>
                        {formErrors.selectedDepartment && <span className="error-message">{formErrors.selectedDepartment}</span>}
                    </div>

                    <button type="submit" className="admin-submit-button">Create Department</button>
                </form>
            </div>
        </div>
    );
}

export default NewCategoryComponent;

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { baseUrl, apiPrefixV1 } from '../../../constants/AppConstants';
import './CategoryComponent.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux';
import { logout } from '../../../redux/slices/authSlice';
function CategoryComponent() {
    const [categories, setCategories] = useState([]);
    const userData = useSelector((state) => state.auth.userData);
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const loadCategories = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${userData.accessToken}`,
            },
        };

        try {
            const response = await axios.get(`${baseUrl}/${apiPrefixV1}/category`, config);
            const code = response.data.code;
            if (code === 2000) {
                setCategories(response.data.data);
            } else if (code === 2003) {
                console.log('token expired!');
                toast.info("Login again", { autoClose: true, position: 'top-right', pauseOnHover: false });
                dispatch(logout())
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
        loadCategories();
    }, []);

    const handleDeleteCategory = async (categoryToken) => {
        try {
            const response = await axios.delete(`${baseUrl}/${apiPrefixV1}/category/${categoryToken}`, {
                headers: {
                    Authorization: `Bearer ${userData.accessToken}`,
                },
            });
            const code = response.data.code;
            if (code === 2000) {
                setCategories(categories.filter(category => category.categoryToken !== categoryToken));
            } else if (code === 2003) {
                dispatch(logout())
                toast.info("Login again!", { autoClose: true, position: 'top-right', pauseOnHover: false });
                navigate('/admin')
            }
            else if (code === 2001) {
                toast.error("You do not have permission to delete category!", { autoClose: true, position: 'top-right', pauseOnHover: false });
            }
            else {
                toast.error("Failed to delete category", { autoClose: true, position: 'top-right', pauseOnHover: false });
            }
        } catch (error) {
            toast.error("Some error occurred!", { autoClose: true, position: 'top-right', pauseOnHover: false });
        }
    };

    return (
        <div className="user-component">
            <div className="buttons">
                <button onClick={() => { navigate('/admin/dashboard/category/new') }}>Add a new category</button>
            </div>
            <h2>Category List</h2>
            {
                (categories.length !== 0) ?
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category) => (
                                    <tr key={category.categoryToken}>

                                        <td>
                                            <Link className="category-link" to={`/admin/dashboard/category/${category.categoryToken}`}>{category.categoryName}</Link>
                                        </td>
                                        <td>{category.categoryDescription}</td>
                                        <td>
                                            <button className='delete-btn' onClick={() => handleDeleteCategory(category.categoryToken)}>Delete</button>
                                        </td>

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
    );
}

export default CategoryComponent;

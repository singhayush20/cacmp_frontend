import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './DeptCategoriesComponent.css'
import { baseUrl, apiPrefixV1 } from '../../../constants/AppConstants';
import { logout } from '../../../redux/slices/authSlice';
import { toast } from "react-toastify"
import LoadingIndicator1 from '../../LoadingIndicator1/LoadingIndicator1';
function DeptCategoriesComponent() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector(state => state.auth.userData);
    const departmentObjective = useSelector(state => state.department.objective)
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        loadCategories();
    }, [])
    const loadCategories = async () => {
        setIsLoading(true)
        const config = {
            headers: {
                Authorization: `Bearer ${userData.accessToken}`,
            },
        }

        try {
            const response = await axios.get(`${baseUrl}/${apiPrefixV1}/category/all?departmentToken=${userData['token']}`, config);
            const code = response.data['code']
            if (code === 2000) {
                setCategories(response.data['data'])
                setIsLoading(false)
            }
            else if (code === 2003) {
                console.log('token expired!');
                dispatch(logout())
                toast.info("Login again!", { autoClose: true, position: 'top-right', pauseOnHover: false });
                navigate('/login')
            }
            else {
                toast.error("Failed to load data!", { autoClose: true, position: 'top-right', pauseOnHover: false });
            }
        }
        catch (err) {
            toast.error("Some error occurred!", { autoClose: true, position: 'top-right', pauseOnHover: false });

        }
    }
    return (
        <div className="main-content">
            {isLoading ? <div className="loading"><LoadingIndicator1 color="#36d7b7" size={50} /></div> : (
                <React.Fragment>
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
                </React.Fragment>
            )}
        </div>
    );
    
}

export default DeptCategoriesComponent
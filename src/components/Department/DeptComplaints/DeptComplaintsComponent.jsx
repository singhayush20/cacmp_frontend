import React, { useEffect, useState } from 'react';
import './DeptComplaintsComponent.css';
import { useNavigate, useParams } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import axios from 'axios';
import { baseUrl, apiPrefixV1 } from '../../../constants/AppConstants';
import { useDispatch } from 'react-redux';
import { logout } from '../../../redux/slices/authSlice';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import LoadingIndicator2 from '../../LoadingIndicator2/LoadingIndicator2';
function DeptComplaintsComponent() {
    const { categoryToken } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userData = useSelector(state => state.auth.userData);
    const [isLoading, setIsLoading] = useState(false);
    const handleBack = () => {
        navigate('/dashboard');
    };

    const [filter, setFilter] = useState({
        status: '',
        priority: '',
        pincode: '',
        wardNo: '',
        sortBy: ''
    });

    const [complaints, setComplaints] = useState([]);

    useEffect(() => {
        loadComplaintsOnPageLoad();
    }, [])

    const loadComplaintsOnPageLoad = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/${apiPrefixV1}/complaints/filter`, {
                params: {
                    categoryToken,
                },
                headers: {
                    Authorization: `Bearer ${userData.accessToken}`,
                },

            });
            const code = response.data.code;
            if (code === 2000) {
                setComplaints(response.data.data);
                setIsLoading(false);
            }
            else if (code === 2003) {
                console.log('token expired!');
                toast.info("Login again!", { autoClose: true, position: 'top-right', pauseOnHover: false });
                dispatch(logout());
                navigate('/dashboard');
            }
            else {
                toast.error("Failed to load data!", { autoClose: true, position: 'top-right', pauseOnHover: false });
            }
        } catch (error) {
            toast.error("Some error occurred!", { autoClose: true, position: 'top-right', pauseOnHover: false });
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilter(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSearch = async () => {

        const parameters = {
            categoryToken: categoryToken,
        }

        if (filter.status) {
            parameters.status = filter.status
        }
        if (filter.priority) {
            parameters.priority = filter.priority
        }
        if (filter.pincode) {
            parameters.pincode = filter.pincode
        }
        if (filter.wardNo) {
            parameters.wardNo = filter.wardNo
        }
        if (filter.sortBy) {
            parameters.sortBy = filter.sortBy
        }

        try {
            const response = await axios.get(`${baseUrl}/${apiPrefixV1}/complaints/filter`, {
                params: {
                    ...parameters
                },
                headers: {
                    'Authorization': `Bearer ${userData.accessToken}`
                }

            });

            const code = response.data.code;
            if (code === 2000) {
                setComplaints(response.data.data);
            }
            else if (code === 2003) {
                console.log('token expired!');
                navigate('/dashboard');
                dispatch(logout());
            }
        } catch (error) {
            console.error('Error fetching complaints:', error.message);
        }
    };



    return (
        <div className="complaints-container">
            <div className="complaints-back-button" onClick={handleBack}>
                <FaIcons.FaArrowLeft />
            </div>
            <div className="complaints">
                <div className='heading'>Seach with a filter</div>
            </div>
            <div className="filter-section">
                <div className="filter-column">
                    <label>Pincode:</label>
                    <input
                        type="text"
                        name="pincode"
                        value={filter.pincode}
                        onChange={handleInputChange}
                        maxLength={6} // Limit input to 6 characters
                        onInput={(e) => {
                            if (e.target.value) {
                                const inputValue = e.target.value.trim();
                                e.target.value = /^\d*$/.test(inputValue) ? Math.max(0, parseInt(inputValue)).toString().slice(0, 6) : '';
                            }
                        }}
                    />
                    <label>Ward No:</label>
                    <input
                        type="text"
                        name="wardNo"
                        value={filter.wardNo}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="filter-column">
                    <label>Status:</label>
                    <select
                        name="status"
                        value={filter.status}
                        onChange={handleInputChange}
                    >
                        <option value="">Select</option>
                        <option value="OPEN">OPEN</option>
                        <option value="REVIEWED">REVIEWED</option>
                        <option value="CLOSED">CLOSED</option>
                    </select>
                    <label>Priority:</label>
                    <select
                        name="priority"
                        value={filter.priority}
                        onChange={handleInputChange}
                    >
                        <option value="">Select</option>
                        <option value="LOW">LOW</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HIGH">HIGH</option>
                    </select>
                </div>
                <div className="filter-column">
                    <label>Sort By:</label>
                    <select
                        name="sortBy"
                        value={filter.sortBy}
                        onChange={handleInputChange}
                    >
                        <option value="">Select</option>
                        <option value="createdAt">Added recently</option>
                        <option value="updatedAt">Updated recently</option>
                    </select>
                    <button className="search-button" onClick={handleSearch}>Search</button>
                </div>
            </div>
            <div className="complaints">
                <div className='heading'>Complaints</div>
            </div>
            {isLoading ? (
                <div className="loading"><LoadingIndicator2 color="#36d7b7" size={50} /></div>
            ) : (
                (complaints.length !== 0) ? (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Subject</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Priority</th>
                                </tr>
                            </thead>
                            <tbody>
                                {complaints.map((complaint) => (
                                    <tr key={complaint.complaintToken}>
                                        <td>
                                            <Link className="complaint-link" to={`/dashboard/complaint/${complaint.complaintToken}`}>{complaint.complaintSubject}</Link>
                                        </td>
                                        <td>{complaint.complaintDescription}</td>
                                        <td>{complaint.complaintStatus}</td>
                                        <td>{complaint.complaintPriority}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="no-data">
                        <p>No complaints</p>
                    </div>
                )
            )}
        </div>
    );
    
}

export default DeptComplaintsComponent;

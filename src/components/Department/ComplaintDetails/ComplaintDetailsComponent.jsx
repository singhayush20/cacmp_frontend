import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl, apiPrefixV1 } from '../../../constants/AppConstants';
import { logout } from '../../../redux/slices/authSlice';
import { useSelector } from 'react-redux';
import './ComplaintDetailsComponent.css';
import * as FaIcons from 'react-icons/fa';
import StatusDialog from '../StatusModal/StatusUpdateModal';
import { toast } from 'react-toastify';
import FeedbackDialog from '../FeedbackModal/FeedbackModal';
function ComplaintDetailsComponent() {
    const { complaintToken } = useParams();
    const navigate = useNavigate();
    const userData = useSelector(state => state.auth.userData);
    const [complaintDetails, setComplaintDetails] = useState(null);
    const [complaintImages, setComplaintImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
    const [feedbackData, setFeedbackData] = useState(null);
    const handleBack = () => {
        navigate('/dashboard');
    };

    const fetchComplaintDetails = async () => {
        try {
            const detailsResponse = await axios.get(`${baseUrl}/${apiPrefixV1}/complaints/details`, {
                params: {
                    token: complaintToken
                },
                headers: {
                    Authorization: `Bearer ${userData.accessToken}`,
                },
            });
            const imagesResponse = await axios.get(`${baseUrl}/${apiPrefixV1}/complaints/details/images`, {
                params: {
                    token: complaintToken
                },
                headers: {
                    Authorization: `Bearer ${userData.accessToken}`,
                },
            });

            if (detailsResponse.data.code === 2000 && imagesResponse.data.code === 2000) {
                setComplaintDetails(detailsResponse.data.data);
                setComplaintImages(imagesResponse.data.data);
                loadFeedback();
            } else if (detailsResponse.data.code === 2003 || imagesResponse.data.code === 2003) {
                console.log('Token expired!');
                navigate('/dashboard');
                dispatch(logout());
                toast.info('Login again!', { autoClose: true, position: 'top-right', pauseOnHover: false });
            } else {
                setError('Failed to fetch complaint details');
                toast.error('Failed to load data!', { autoClose: true, position: 'top-right', pauseOnHover: false });
            }
        } catch (error) {
            setError('Failed to fetch complaint details');
            toast.error('Some error occurred!', { autoClose: true, position: 'top-right', pauseOnHover: false });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaintDetails();
    }, []);

    const handleStatus = async () => {
        setShowDialog(true);
    };

    const handleUpdateStatus = async newStatus => {
        try {
            const updateStatusResponse = await axios.put(
                `${baseUrl}/${apiPrefixV1}/complaints/change-status`,
                {
                    complaintToken: complaintToken,
                    complaintStatus: newStatus
                },
                {
                    headers: {
                        Authorization: `Bearer ${userData.accessToken}`,
                    },
                }
            );
            if (updateStatusResponse.data.code === 2000) {
                toast.success('Status updated successfully!', { autoClose: true, position: 'top-right', pauseOnHover: false });
                setShowDialog(false);
                fetchComplaintDetails();
            } else if (updateStatusResponse.data.code === 2003) {
                console.log('Token expired!');
                navigate('/dashboard');
                dispatch(logout());
            } else {
                setError('Failed to update status');
                toast.error('Failed to update status', { autoClose: true, position: 'top-right', pauseOnHover: false });
            }
        } catch (err) {
            setError(`Error occurred!: ${err.message}`);
            toast.error('Some error occurred!', { autoClose: true, position: 'top-right', pauseOnHover: false });
        } finally {
            setLoading(false);
        }
    };

    const handleCancelDialog = () => {
        setShowDialog(false);
    };

    // Function to fetch feedback
    const loadFeedback = async () => {
        try {
            const feedbackResponse = await axios.get(`${baseUrl}/${apiPrefixV1}/complaints/feedback/${complaintToken}`, {
                headers: {
                    Authorization: `Bearer ${userData.accessToken}`,
                },
            });

            if (feedbackResponse.data.code === 2000) {
                setFeedbackData(feedbackResponse.data.data);
            }
            else if (feedbackResponse.data.code === 2003) {
                console.log('Token expired!');
                navigate('/login');
                dispatch(logout());
            }
           
        } catch (error) {
            console.error('Failed to fetch feedback:', error);
            toast.error('Failed to fetch feedback', { autoClose: true, position: 'top-right', pauseOnHover: false });
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="complaint-details-container">
            <div className="details-back-button" onClick={handleBack}>
                <FaIcons.FaArrowLeft />
            </div>
            <div className="complaint-details">
                <div className="heading-btn">
                    <div className="heading">Complaint Details</div>
                  <div className="btns">
                  <button className="status-btn" onClick={handleStatus}>
                        Update Status
                    </button>
                    {complaintDetails?.complaintStatus === 'CLOSED' && ( // Show "Show Feedback" button if status is CLOSED
                        <button className="feedback-btn" onClick={() => setShowFeedbackDialog(true)}>
                            Show Feedback
                        </button>
                    )}
                  </div>
                </div>
                {complaintDetails && (
                    <div className="details">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <strong>Subject:</strong>
                                    </td>
                                    <td>{complaintDetails.complaintSubject}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Description:</strong>
                                    </td>
                                    <td>{complaintDetails.complaintDescription}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Status:</strong>
                                    </td>
                                    <td>{complaintDetails.complaintStatus}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Priority:</strong>
                                    </td>
                                    <td>{complaintDetails.complaintPriority}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Address:</strong>
                                    </td>
                                    <td>{complaintDetails.address}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Contact Number:</strong>
                                    </td>
                                    <td>{complaintDetails.contactNo}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Consumer Name:</strong>
                                    </td>
                                    <td>{complaintDetails.consumerName}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Consumer Phone:</strong>
                                    </td>
                                    <td>{complaintDetails.consumerPhone}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Pincode:</strong>
                                    </td>
                                    <td>{complaintDetails.pincode}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Ward No:</strong>
                                    </td>
                                    <td>{complaintDetails.wardNo}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {(complaintImages && complaintImages.length > 0) && (
                    <div className="image-box">
                        <div className="image-box-heading">Complaint Images</div>
                        <div className="images">
                            {complaintImages.map((image, index) => (
                                <img key={index} src={image} alt={`Complaint Image ${index + 1}`} onClick={() => window.open(image, '_blank')} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
                {showDialog && <StatusDialog currentStatus={complaintDetails.complaintStatus} onUpdate={(handleUpdateStatus)} onCancel={handleCancelDialog} />}
                {showFeedbackDialog && <FeedbackDialog onClose={() => setShowFeedbackDialog(false)} feedbackData={feedbackData} />}
        </div>
    );
}

export default ComplaintDetailsComponent;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import './DeptPollDetailsComponent.css';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../../redux/slices/authSlice';
import { toast } from 'react-toastify';
import LoadingIndicator2 from '../../LoadingIndicator2/LoadingIndicator2';
import { baseUrl, apiPrefixV1 } from '../../../constants/AppConstants';
import { Chart } from 'chart.js/auto';

function DeptPollDetailsComponent() {
  const navigate = useNavigate();
  const { pollToken } = useParams();
  const dispatch = useDispatch();
  const [pollDetails, setPollDetails] = useState(null);
  const userData = useSelector(state => state.auth.userData);
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const fetchPollDetails = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/${apiPrefixV1}/poll/details`, {
        headers: {
          Authorization: `Bearer ${userData.accessToken}`,
        },
        params: {
          token: pollToken
        }
      });
      if (response.data.code === 2000) {
        setPollDetails(response.data.data);
        setIsLoading(false);
        console.log(response.data.data);
      } else if (response.data.code === 2003) {
        console.log('Token expired!');
        dispatch(logout());
        navigate('/login');
        toast.info('Login again!', { autoClose: true, position: 'top-right', pauseOnHover: false });
      } else {
        toast.error('Failed to load data!', { autoClose: true, position: 'top-right', pauseOnHover: false });
      }
    } catch (error) {
      console.log(error.message);
      toast.error('Some error occurred!', { autoClose: true, position: 'top-right', pauseOnHover: false });
    }
  };

  useEffect(() => {
    fetchPollDetails();
  }, []);

  const changeStatus = async (status) => {
    try {
      const response = await axios.put(
        `${baseUrl}/${apiPrefixV1}/poll/status`,
        {
          token: pollToken,
          status: status
        },
        {
          headers: {
            Authorization: `Bearer ${userData.accessToken}`
          },
        }
      );
      console.log(response.data);
      const code = response.data.code;
      if (code === 2000) {
        toast.success("Status changed successfully!", { autoClose: true, position: 'top-right', pauseOnHover: false });
        fetchPollDetails();
      }
      else if (response.data.code === 2003) {
        console.log('Token expired!');
        dispatch(logout());
        navigate('/login');
        toast.info('Login again!', { autoClose: true, position: 'top-right', pauseOnHover: false });
      } else {
        toast.error('Failed to update status!', { autoClose: true, position: 'top-right', pauseOnHover: false });
      }
    } catch (error) {
      console.log(error.message);
      toast.error('Some error occurred!', { autoClose: true, position: 'top-right', pauseOnHover: false });
    }
  }

  const handleBack = () => {
    navigate(-1);
  };

  const toggleDialog = () => {
    setShowDialog(!showDialog);
  };

  const handleShowCount = () => {
    toggleDialog();
  };

  useEffect(() => {
    if (showDialog && pollDetails) {
      drawPieChart();
    }
  }, [showDialog, pollDetails]);

  const drawPieChart = () => {
    const ctx = document.getElementById('pollPieChart');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: pollDetails.pollChoiceDetails.map(choice => choice.choiceName),
        datasets: [{
          label: 'Vote Count',
          data: pollDetails.pollChoiceDetails.map(choice => choice.voteCount),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Vote Count Distribution'
          }
        }
      }
    });
  };

  if (isLoading) {
    return <div className="loading"><LoadingIndicator2 color="#36d7b7" size={50} /></div>
  }

  return (
    <div className="dept-poll-details-container">
      <div className="back-button" onClick={handleBack}>
        <FaIcons.FaArrowLeft />
      </div>
      <div className="poll-details">
        {pollDetails && (
          <>
            <h2>Poll Details</h2>
            <div className="poll-details">
              <table className='poll-details-table'>
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Subject</td>
                    <td>{pollDetails.subject}</td>
                  </tr>
                  <tr>
                    <td>Description</td>
                    <td>{pollDetails.description}</td>
                  </tr>
                  <tr>
                    <td>Department Name</td>
                    <td>{pollDetails.departmentName}</td>
                  </tr>
                  <tr>
                    <td>Live status</td>
                    <td>{pollDetails.isLive ? 'Yes' : 'No'}</td>
                  </tr>
                  <tr>
                    <td>Poll Choices</td>
                    <td>
                      <ul>
                        {pollDetails.pollChoiceDetails.map(choice => (
                          <li key={choice.choiceToken}>{choice.choiceName}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="buttons">
              <button onClick={handleShowCount}>Show Count</button>
              <button onClick={() => changeStatus(!pollDetails.isLive)}>{pollDetails.isLive ? 'Close Poll' : 'Open Poll'}</button>
            </div>
            {showDialog && (
              <div className="modal" onClick={toggleDialog}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                  <canvas id="pollPieChart"></canvas>
                  <button className="dialog-close-btn" onClick={toggleDialog}>Close</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default DeptPollDetailsComponent;

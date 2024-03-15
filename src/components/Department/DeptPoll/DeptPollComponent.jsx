import React, { useEffect, useState } from 'react';
import './DeptPollComponent.css';
import axios from 'axios';
import { baseUrl, apiPrefixV1 } from '../../../constants/AppConstants';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from "react-toastify";
import LoadingIndicator2 from '../../LoadingIndicator2/LoadingIndicator2';
import { logout } from '../../../redux/slices/authSlice';
import { Link, useNavigate } from 'react-router-dom';
function DeptPollComponent() {
  const userData = useSelector(state => state.auth.userData);
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [polls, setPolls] = useState([]);
  const [filter, setFilter] = useState({
    isLive: '',
    sortBy: ''
  });

  useEffect(() => {
    loadPolls();
  }, []);

  const loadPolls = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/${apiPrefixV1}/poll/all`, {
        params: {
          isLive: (filter.isLive.length === 0) ? null : filter.isLive,
          sortBy: (filter.sortBy.length === 0) ? null : filter.sortBy,
          token: userData.token,
        },
        headers: {
          Authorization: `Bearer ${userData.accessToken}`,
        },
      });
      const code = response.data.code;
      console.log(code)
      console.log(response.data);
      if (code === 2000) {
        setPolls(response.data.data);
        setIsLoading(false);
      }
      else if (code === 2003) {
        console.log('token expired!');
        toast.info("Login again!", { autoClose: true, position: 'top-right', pauseOnHover: false });
        dispatch(logout());
        navigate('/login');
      }
      else {
        toast.error("Failed to load data!", { autoClose: true, position: 'top-right', pauseOnHover: false });
      }
    } catch (error) {

      toast.error("Some error occurred!", { autoClose: true, position: 'top-right', pauseOnHover: false });
      console.log(error)
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilter(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className="polls-container">
      <div className="polls">
        <h2>Polls</h2>
        <button className='poll-new-button' onClick={() => navigate("/dashboard/poll/new")}>Add Poll </button>
      </div>
      <div className="polls-filter-section">
        <div className="filter-column">
          <label>Is Live:</label>
          <select
            name="isLive"
            value={filter.isLive}
            onChange={handleInputChange}
          >
            <option value="">All</option>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>
        </div>
        <div className="polls-filter-column">
          <label>Sort By:</label>
          <select
            name="sortBy"
            value={filter.sortBy}
            onChange={handleInputChange}
          >
            <option value="">Select</option>
            <option value="createdAt">Created Recently</option>
            <option value="updatedAt">Updated Recently</option>
          </select>
        </div>
      </div>
      <button className="polls-search-button" onClick={loadPolls}>Search</button>


      {isLoading ? (
        <div className="loading"><LoadingIndicator2 color="#36d7b7" size={50} /></div>
      ) : (
        (polls.length !== 0) ? (
          <div className="polls-table-container">
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Description</th>
                  <th>Created On</th>
                  <th>Is Live</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {polls.map((poll) => (
                  <tr key={poll.pollToken}>
                    <td><Link to={`/dashboard/poll/${poll.pollToken}`} className='poll-details-link'>{poll.subject}</Link></td>
                    <td>{poll.description}</td>
                    <td>{new Date(poll.createdOn).toLocaleString()}</td>
                    <td>{poll.isLive ? 'Yes' : 'No'}</td>
                    <td><button className='poll-delete-button'>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="polls-no-data">
            <p>No polls</p>
          </div>
        )
      )}
    </div>
  );
}

export default DeptPollComponent;

import  { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl, apiPrefixV1 } from '../../../constants/AppConstants';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from "react-toastify";
import LoadingIndicator2 from '../../LoadingIndicator2/LoadingIndicator2';
import { logout } from '../../../redux/slices/authSlice';
import { Link, useNavigate } from 'react-router-dom';

function DeptNoticeComponent() {
  const userData = useSelector(state => state.auth.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [notices, setNotices] = useState([]);
  const [filter, setFilter] = useState({
    status: '',
    sortBy: ''
  });

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/${apiPrefixV1}/alert/all`, {
        params: {
          token: userData.token,
          status: filter.status.length === 0 ? null : filter.status,
          sortBy: filter.sortBy.length === 0 ? null : filter.sortBy
        },
        headers: {
          Authorization: `Bearer ${userData.accessToken}`,
        },
      });
      const code = response.data.code;
      if (code === 2000) {
        setNotices(response.data.data);
        setIsLoading(false);
      } else if (code === 2003) {
        console.log('token expired!');
        toast.info("Login again!", { autoClose: true, position: 'top-right', pauseOnHover: false });
        dispatch(logout());
        navigate('/login');
      } else {
        toast.error("Failed to load data!", { autoClose: true, position: 'top-right', pauseOnHover: false });
      }
    } catch (error) {
      toast.error("Some error occurred!", { autoClose: true, position: 'top-right', pauseOnHover: false });
      console.log(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilter(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handlePublish = async (index) => {
    setIsLoading(true);
    try {
      const response = await axios.put(`${baseUrl}/${apiPrefixV1}/alert/update-status`,
        {
          token: notices[index]['alertToken'],
          publishStatus: (notices[index]['publishStatus'] === "DRAFT") ? "PUBLISHED" : "DRAFT"
        },
        {
          headers: {
            Authorization: `Bearer ${userData.accessToken}`,
          },
        });
      const code = response.data.code;
      if (code === 2000) {
        // setNotices(response.data.data);
        setIsLoading(false);
        loadNotices();
      } else if (code === 2003) {
        console.log('token expired!');
        toast.info("Login again!", { autoClose: true, position: 'top-right', pauseOnHover: false });
        dispatch(logout());
        navigate('/login');
      } else {
        toast.error("Failed to update status!", { autoClose: true, position: 'top-right', pauseOnHover: false });
      }
    } catch (error) {
      toast.error("Some error occurred!", { autoClose: true, position: 'top-right', pauseOnHover: false });
      console.log(error.message);
    }
  }

  const handleDelete = async (alertToken) => {
    try {
      const response = await axios.delete(`${baseUrl}/${apiPrefixV1}/alert/${alertToken}`, {
        headers: {
          Authorization: `Bearer ${userData.accessToken}`,
        },
      });
      const code = response.data.code;
      if (code === 2000) {
        toast.success("Alert deleted successfully", { autoClose: true, position: 'top-right', pauseOnHover: false });
        const noticeList=notices.filter((notice)=>notice.alertToken!=alertToken)
        setNotices(noticeList)
      } else if (code === 2003) {
        console.log('token expired!');
        toast.info("Login again!", { autoClose: true, position: 'top-right', pauseOnHover: false });
        dispatch(logout());
        navigate('/login');
      } else {
        toast.error("Failed to load data!", { autoClose: true, position: 'top-right', pauseOnHover: false });
      }
    } catch (error) {
      toast.error("Some error occurred!", { autoClose: true, position: 'top-right', pauseOnHover: false });
      console.log(error);
    }
  }

  return (
    <div className="polls-container">
      <div className="polls">
        <h2>Notices</h2>
        <button className='department-new-button' onClick={() => navigate("/dashboard/notice/new")}>Add Notice </button>
      </div>
      <div className="polls-filter-section">
        <div className="filter-column">
          <label>Published:</label>
          <select
            name="status"
            value={filter.status}
            onChange={handleInputChange}
          >
            <option value="">All</option>
            <option value={"PUBLISHED"}>Published</option>
            <option value={"DRAFT"}>Draft</option>
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
            <option value="createdAt">Created Recently</option>
            <option value="updatedAt">Updated Recently</option>
          </select>
        </div>
      </div>
      <button className="department-search-button" onClick={loadNotices}>Search</button>

      {isLoading ? (
        <div className="loading"><LoadingIndicator2 color="#36d7b7" size={50} /></div>
      ) : (
        (notices.length !== 0) ? (
          <div className="polls-table-container">
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Created On</th>
                  <th>Published On</th>
                  <th>Type</th>
                  <th>Delete</th>
                  <th>Publish</th>
                </tr>
              </thead>
              <tbody>
                {notices.map((notice, index) => (
                  <tr key={notice.alertToken}>
                    <td><Link to={`/dashboard/notice/${notice.alertToken}`} className='poll-details-link'>{notice.subject}</Link></td>
                    <td>{new Date(notice.createdAt).toLocaleString()}</td>
                    <td>{notice.publishedOn ? new Date(notice.publishedOn).toLocaleString() : '------------------'}</td>
                    <td>{notice.alertInputType}</td>
                    <td><button className='department-delete-button' onClick={()=>handleDelete(notice.alertToken)}>Delete</button></td> 
                    <td><button className='department-delete-button' onClick={() => handlePublish(index)}>{notice.publishStatus === 'DRAFT' ? 'Publish' : 'Un-publish'}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="polls-no-data">
            <p>No notices</p>
          </div>
        )
      )}
    </div>
  );

  //TODO: DELETE BUTTON MUST BE ENABLED
}

export default DeptNoticeComponent;

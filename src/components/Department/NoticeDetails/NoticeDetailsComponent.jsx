import  { useEffect } from 'react';
import './NoticeDetailsComponent.css';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../redux/slices/authSlice';
import { baseUrl, apiPrefixV1 } from '../../../constants/AppConstants';
import { toast } from 'react-toastify';
import axios from 'axios';
import LoadingIndicator2 from '../../LoadingIndicator2/LoadingIndicator2';
import * as FaIcons from 'react-icons/fa';

function NoticeDetailsComponent() {
  const { alertToken } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [noticeData, setNoticeData] = useState(null);
  const userData = useSelector(state => state.auth.userData);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchNoticeDetails = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/${apiPrefixV1}/alert`, {
        params: {
          token: alertToken,
        },
        headers: {
          Authorization: `Bearer ${userData.accessToken}`,
        },
      });
      const code = response.data.code;
      if (code === 2000) {
        setNoticeData(response.data.data);
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
      console.log(error.message)
      toast.error("Some error occurred!", { autoClose: true, position: 'top-right', pauseOnHover: false });
      console.log(error);
    }
  }

  useEffect(() => {
    fetchNoticeDetails();
  }, []);

  const handleBack = () => {
    navigate(-1);
  }

  if (isLoading || noticeData === null) {
    return (<div className="alert-details-loading"><LoadingIndicator2 color="#36d7b7" size={50} /></div>)
  }

  if (noticeData['alertInputType'] === 'DOCUMENT') {
    return (
      <div className="details-container">
        <div className="notice-left">
          <div className="back-button" onClick={handleBack}>
            <FaIcons.FaArrowLeft />
          </div>
          <div className="details-table-container">
            <table >
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Subject</td>
                  <td>{noticeData['subject']}</td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td>{noticeData['publishStatus']}</td>
                </tr>
                <tr>
                  <td>Published On</td>
                  <td>{(noticeData['publishedOn']) ? new Date(noticeData['publishedOn']).toLocaleString() : 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="pdf-container">
          <embed className="pdf-embed" src={`${noticeData['alertDocuments'][0]['documentUrl']}/preview`}></embed>
        </div>
      </div>
    );
  } else if (noticeData['alertInputType'] === "TEXT") {
    return (
      <div className="details-container">
        <div className="notice-left">
          <div className="back-button" onClick={handleBack}>
            <FaIcons.FaArrowLeft />
          </div>
          <div className="details-table-container">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Subject</td>
                  <td>{noticeData['subject']}</td>
                </tr>
                <tr>
                  <td>Message</td>
                  <td>{noticeData['message']}</td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td>{noticeData['publishStatus']}</td>
                </tr>
                <tr>
                  <td>Published On</td>
                  <td>{noticeData['publishedOn'] ? noticeData['publishedOn'] : 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="images-container">
          {noticeData['alertImages'].map((imageUrl, index) => (
            <img key={index} src={imageUrl} alt={`Image ${index + 1}`} className="image-item" />
          ))}
        </div>
      </div>
    );
  }
}

export default NoticeDetailsComponent;

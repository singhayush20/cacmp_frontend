// AnalyticsDashboard.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DashboardHome.css'; // Import CSS file for dashboard styling
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { baseUrl, apiPrefixV1 } from '../../../constants/AppConstants';
const DashboardHome = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const dispatch = useDispatch();
  const userData = useSelector(state => state.auth.userData);
  const navigate = useNavigate();


  const loadAnalyticsData = async () => {
    try {
      const analyticsResponse = await axios.get(`${baseUrl}/${apiPrefixV1}/analytics/admin-dashboard`, {
        headers: {
          Authorization: `Bearer ${userData.accessToken}`,
        },
      });

      if (analyticsResponse.data.code === 2000) {
        setAnalyticsData(analyticsResponse.data.data);
      }
      else if (analyticsResponse.data.code === 2003) {
        console.log('Token expired!');
        navigate('/dashboard');
        dispatch(logout());
        toast.info('Login again!', { autoClose: true, position: 'top-right', pauseOnHover: false });
      } else {
        setError('Failed to load data');
        toast.error('Failed to load data!', { autoClose: true, position: 'top-right', pauseOnHover: false });
      }
    }
    catch (err) {
      setError('Failed to load data!');
      toast.error('Some error occurred!', { autoClose: true, position: 'top-right', pauseOnHover: false });
    }

  }

  useEffect(() => {
    loadAnalyticsData();
  }, []);





  return (
    <div className="dashboard">
      <h1>System Metrics</h1>
      {(analyticsData != null) ?

        <div className="metrics">
          <div className="count-container">

            <div id="category">
              <h3>Category</h3>
              <p>
                {analyticsData.categoryCount}
              </p>


            </div>
            <div id="department">
              <h3>Department</h3>
              <p>
                {analyticsData.departmentCount}
              </p>
            </div>
            <div id="user">
              <h3>User</h3>
              <p>
                {analyticsData.consumerCount}
              </p>
            </div>
            <div id="complaint-count">
              <h3>Total complaints</h3>
              <p>
                {analyticsData.totalComplaintsCount}
              </p>
            </div>
            <div id="resolution-time">
              <h3>Average Resolution Time</h3>
              <p>
                {analyticsData.averageResolutionTime}
              </p>
            </div>
          </div>

          <div className="tables">
            <div className="row1">
              <div className="complaint-count-table">
                <h3>Complaints Count by Department</h3>
                <table className='analytics-table'>
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.complaintsCountByDepartment.map((complaint, index) => (
                      <tr key={index}>
                        <td>{complaint.department}</td>
                        <td>{complaint.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="complaint-count-table">
                <h3>Complaints Count by Category</h3>
                <table className='analytics-table'>
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.complaintsCountByCategory.map((complaint, index) => (
                      <tr key={index}>
                        <td>{complaint.category}</td>
                        <td>{complaint.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="complaint-count-table">
                <h3>Complaints Count by Status</h3>
                <table className='analytics-table'>
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.complaintsCountByStatus.map((complaint, index) => (
                      <tr key={index}>
                        <td>{complaint.status}</td>
                        <td>{complaint.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="complaint-count-table">
                <h3>Complaints Count by Priority</h3>
                <table className='analytics-table'>
                  <thead>
                    <tr>
                      <th>Priority</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.complaintsCountByPriority.map((complaint, index) => (
                      <tr key={index}>
                        <td>{complaint.priority}</td>
                        <td>{complaint.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="row2">
              <div className="complaint-count-table">
                <h3>Complaints Count by Pincode</h3>
                <table className='analytics-table'>
                  <thead>
                    <tr>
                      <th>Pincode</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.complaintCountByPincode.map((complaint, index) => (
                      <tr key={index}>
                        <td>{complaint.pincode}</td>
                        <td>{complaint.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="complaint-count-table">
                <h3>Complaints Count by Ward No</h3>
                <table className='analytics-table'>
                  <thead>
                    <tr>
                      <th>Ward No.</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.complaintCountByWardNo.map((complaint, index) => (
                      <tr key={index}>
                        <td>{complaint.wardNo}</td>
                        <td>{complaint.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
            <div className="row2">
              <div className="complaint-count-table">
                <h3>Consumer count by pincode</h3>
                <table className='analytics-table'>
                  <thead>
                    <tr>
                      <th>Pincode</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.consumerCountByPinCode.map((consumer, index) => (
                      <tr key={index}>
                        <td>{consumer.pinCode}</td>
                        <td>{consumer.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="complaint-count-table">
                <h3>Consumer Count by Ward No</h3>
                <table className='analytics-table'>
                  <thead>
                    <tr>
                      <th>Ward No.</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.consumerCountByWardNo.map((consumer, index) => (
                      <tr key={index}>
                        <td>{consumer.wardNo}</td>
                        <td>{consumer.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

            <div className="row3">
             <div className="complaint-count-table">
             <h3>Complaints Count by Department and Priority</h3>
              <table className='analytics-table'>
                <thead>
                  <tr>
                    <th>Department Name</th>
                    <th>Priority</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.complaintsCountByDepartmentAndPriority.map((department, index) => (
                    <React.Fragment key={index}>
                      {department.value.map((priorityItem, priorityIndex) => (
                        <tr key={`${index}-${priorityIndex}`}>
                          {priorityIndex === 0 ? (
                            <td rowSpan={department.value.length}>{department.departmentName}</td>
                          ) : null}
                          <td>{priorityItem.priority}</td>
                          <td>{priorityItem.count}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
             </div>
             <div className="complaint-count-table">
             <h3>Complaints Count by Department and Status</h3>
              <table className='analytics-table'>
                <thead>
                  <tr>
                    <th>Department Name</th>
                    <th>Status</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.complaintsCountByDepartmentAndStatus.map((department, index) => (
                    <React.Fragment key={index}>
                      {department.value.map((priorityItem, priorityIndex) => (
                        <tr key={`${index}-${priorityIndex}`}>
                          {priorityIndex === 0 ? (
                            <td rowSpan={department.value.length}>{department.departmentName}</td>
                          ) : null}
                          <td>{priorityItem.status}</td>
                          <td>{priorityItem.count}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
             </div>
            </div>
          </div>
        </div>

        : null}
    </div>
  );
};

export default DashboardHome;



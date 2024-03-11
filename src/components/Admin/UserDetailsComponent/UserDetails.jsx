import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { baseUrl, apiPrefixV1 } from '../../../constants/AppConstants';
import { logout } from '../../../redux/slices/authSlice';
import * as FaIcons from 'react-icons/fa';
import './UserDetails.css';
import { toast } from "react-toastify";
function UserDetails() {
  const userData = useSelector(state => state.auth.userData);
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    departmentName: '',
    roles: [],
    username: ''
  });
  const [loading, setLoading] = useState(true);
  const [formErrors, setFormErrors] = useState({});

  const loadUserData = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userData.accessToken}`
        }
      };
      const response = await axios.get(`${baseUrl}/${apiPrefixV1}/user/${userId}`, config);
      const code = response.data.code;
      if (code === 2000) {
        const { name, roles, username } = response.data.data;
        setUserInfo({ departmentName: name, roles, username });
      } else if (code === 2003) {
        dispatch(logout())
        toast.info("Login again!", { autoClose: true, position: 'top-right', pauseOnHover: false });
        navigate('/admin')
      }
      else {
        toast.error("Failed to load details", { autoClose: true, position: 'top-right', pauseOnHover: false });
      }
    } catch (error) {
      toast.error("Some error occurred!", { autoClose: true, position: 'top-right', pauseOnHover: false });
    }
    finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log(userInfo);
    if (validateForm()) {
      try {
        const data = {
          userToken: userId,
          username: userInfo.username,
          name: userInfo.name,
          roles: userInfo.roles,
        }
        const response = await axios.put(`${baseUrl}/${apiPrefixV1}/user`, data, {
          headers: {
            Authorization: `Bearer ${userData.accessToken}`
          }
        })
        const code = response.data.code
        if (code === 2000) {
          navigate('/admin/dashboard/users')
        }
        else if (code === 2003) {
          dispatch(logout())
          toast.info("Login again!", { autoClose: true, position: 'top-right', pauseOnHover: false });
          navigate('/admin')
        }
        else if (code === 2001) {
          toast.error("You do not have permission to update user details!", { autoClose: true, position: 'top-right', pauseOnHover: false });
        }
        else {
          toast.error("Failed to update user", { autoClose: true, position: 'top-right', pauseOnHover: false });
        }
      } catch (error) {
        toast.error("Some error occurred!", { autoClose: true, position: 'top-right', pauseOnHover: false });
      }
    }
  };

  const handleBack = () => {
    navigate('/admin/dashboard/users');
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!userInfo.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (!userInfo.username.trim()) {
      errors.username = 'Username is required';
      isValid = false;
    }

    if (!userInfo.roles.length || userInfo.roles[0].length === 0) {
      errors.roles = 'Role is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-details-container">
      <div className="back-button" onClick={handleBack}>
        <FaIcons.FaArrowLeft />
      </div>
      <div className="user-details-form">
        <h2>Edit User Details</h2>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={userInfo.name}
              className={formErrors.username ? 'invalid' : ''}
              onChange={(e) => setUserInfo({ ...userInfo, departmentName: e.target.value })}
            />
            {formErrors.name && <span className="error-message">{formErrors.name}</span>}
          </div>

          <div className='form-group'>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={userInfo.username}
              className={formErrors.username ? 'invalid' : ''}
              onChange={(e) => setUserInfo({ ...userInfo, username: e.target.value })}
            />
            {formErrors.username && <span className="error-message">{formErrors.username}</span>}
          </div>

          <div className='form-group'>
            <label htmlFor="roles">Roles:</label>
            <select
              id="roles"
              value={userInfo.roles[0]}
              className={formErrors.username ? 'invalid' : ''}
              onChange={(e) => setUserInfo({ ...userInfo, roles: [e.target.value] })}
            >
              <option value="">Select Role</option>
              <option value="ROLE_ROOT_ADMIN">Root Admin</option>
              <option value="ROLE_SUB_ADMIN">Sub Admin</option>
            </select>
            {formErrors.roles && <span className="error-message">{formErrors.roles}</span>}
          </div>

          <button type="submit" className='submit-button'>Save</button>
        </form>
      </div>
    </div>
  );
}

export default UserDetails;

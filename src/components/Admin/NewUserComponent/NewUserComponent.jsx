import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import './NewUserComponent.css';
import { useSelector, useDispatch } from 'react-redux';
import { baseUrl, apiPrefixV1 } from '../../../constants/AppConstants';
import { logout } from '../../../redux/slices/authSlice';
import {toast} from "react-toastify";
function NewUserComponent() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const userData = useSelector(state => state.auth.userData);
  const dispatch = useDispatch();
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      try {
        const response = await axios.post(`${baseUrl}/${apiPrefixV1}/user/register`, {
          username: username,
          password: password,
          name: name,
          roles: [role]
        }, {
          headers: {
            Authorization: `Bearer ${userData.accessToken}`
          }
        });
        // Handle successful response
        const code = response.data.code;
        if (code === 2000) {
          toast.success("User created successfully!", { autoClose: true, position: 'top-right', pauseOnHover: false });
          navigate('/admin/dashboard/users');
        }
        else if (code === 2003) {
          dispatch(logout())
          toast.info("Login again!", { autoClose: true, position: 'top-right', pauseOnHover: false });
          navigate('/admin')
        }
        else if (code === 2001) {
          toast.error("You do not have permission to create the user!", { autoClose: true, position: 'top-right', pauseOnHover: false });
        }
        else {
          toast.error("Failed to load data", { autoClose: true, position: 'top-right', pauseOnHover: false });

        }
      } catch (error) {
        toast.error("Some error occurred!", { autoClose: true, position: 'top-right', pauseOnHover: false });
      }
    }
  };

  const handleBack = () => {
    navigate('/admin/dashboard/users');
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!username.trim()) {
      errors.username = 'Username is required';
      isValid = false;
    }

    if (!password.trim()) {
      errors.password = 'Password is required';
      isValid = false;
    }

    if (!confirmPassword.trim()) {
      errors.confirmPassword = 'Confirm password is required';
      isValid = false;
    } else if (confirmPassword !== password) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    if (!name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (!role.trim()) {
      errors.role = 'Role is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  return (
    <div className="new-user-container">
      <div className="back-button" onClick={handleBack}>
        <FaIcons.FaArrowLeft />
      </div>
      <div className="new-user-form">
        <h2>Create New User</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={formErrors.username ? 'invalid' : ''}
            />
            {formErrors.username && <span className="error-message">{formErrors.username}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <div className="password-input">
              <input
                type={isPasswordVisible ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={formErrors.password ? 'invalid' : ''}
              />
              <span className="password-icon" onClick={togglePasswordVisibility}>
                {isPasswordVisible ? <AiIcons.AiOutlineEyeInvisible /> : <AiIcons.AiOutlineEye />}
              </span>
            </div>
            {formErrors.password && <span className="error-message">{formErrors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <div className="password-input">
              <input
                type={isConfirmPasswordVisible ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={formErrors.confirmPassword ? 'invalid' : ''}
              />
              <span className="password-icon" onClick={toggleConfirmPasswordVisibility}>
                {isConfirmPasswordVisible ? <AiIcons.AiOutlineEyeInvisible /> : <AiIcons.AiOutlineEye />}
              </span>
            </div>
            {formErrors.confirmPassword && <span className="error-message">{formErrors.confirmPassword}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={formErrors.name ? 'invalid' : ''}
            />
            {formErrors.name && <span className="error-message">{formErrors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="role">Role:</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={formErrors.role ? 'invalid' : ''}
            >
              <option value="">Select Role</option>
              <option value="ROLE_ROOT_ADMIN">Root Admin</option>
              <option value="ROLE_SUB_ADMIN">Sub Admin</option>
            </select>
            {formErrors.role && <span className="error-message">{formErrors.role}</span>}
          </div>

          <button type="submit" className="admin-submit-button">Create User</button>
        </form>
      </div>
    </div>
  );
}

export default NewUserComponent;

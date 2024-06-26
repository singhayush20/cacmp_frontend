import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { useSelector, useDispatch } from 'react-redux';
import { baseUrl, apiPrefixV1 } from '../../../constants/AppConstants';
import { logout } from '../../../redux/slices/authSlice';
import { toast } from 'react-toastify';
import LoadingIndicator2 from '../../LoadingIndicator2/LoadingIndicator2';
function NewDepartmentComponent() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [objective, setObjective] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const userData = useSelector(state => state.auth.userData);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async () => {
    setIsLoading(true);
    if (validateForm()) {
      try {
        const response = await axios.post(`${baseUrl}/${apiPrefixV1}/department/register`, {
          username: username,
          password: password,
          departmentName: name,
          departmentObjective: objective,
          roles: [role]
        }, {
          headers: {
            Authorization: `Bearer ${userData.accessToken}`
          }
        });
        // Handle successful response
        const code = response.data.code;
        console.log(response.data);
        if (code === 2000) {
          setIsLoading(false);
          navigate(-1);
        }
        else if (code === 2003) {
          dispatch(logout())
          toast.info("Login again!", { autoClose: true, position: 'top-right', pauseOnHover: false });
          navigate('/admin')
        }
        else if (code === 2001) {
          toast.error("You do not have permission to create department", { autoClose: true, position: 'top-right', pauseOnHover: false });
        }
        else {
          toast.error("Failed to create department", { autoClose: true, position: 'top-right', pauseOnHover: false });
        }
      } catch (error) {
        toast.error("Some error occurred!", { autoClose: true, position: 'top-right', pauseOnHover: false });
      }

    }
  };

  const handleBack = () => {
    navigate('/admin/dashboard/department');
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

    if (!objective.trim()) {
      errors.objective = 'Objective is required';
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
        <h2>Create New Department Account</h2>
        <form >
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
            <label htmlFor="name">Objective:</label>
            <input
              type="text"
              id="name"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className={formErrors.objective ? 'invalid' : ''}
            />
            {formErrors.objective && <span className="error-message">{formErrors.objective}</span>}
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
              <option value="ROLE_DEPARTMENT">Department Admin</option>
            </select>
            {formErrors.role && <span className="error-message">{formErrors.role}</span>}
          </div>

          {isLoading ? <LoadingIndicator2 color={'green'} size={25} /> :
            <button type="submit" className="admin-submit-button" onClick={() => handleSubmit()}>
              Submit
            </button>}
        </form>
      </div>
    </div>
  );
}

export default NewDepartmentComponent;

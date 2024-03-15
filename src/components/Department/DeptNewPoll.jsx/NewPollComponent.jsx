import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './NewPollComponent.css';
import * as FaIcons from 'react-icons/fa'
import { logout } from '../../../redux/slices/authSlice';
import authSlice from '../../../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { baseUrl, apiPrefixV1 } from '../../../constants/AppConstants';
import LoadingIndicator2 from '../../LoadingIndicator2/LoadingIndicator2';
function NewPollComponent() {
    const navigate = useNavigate();
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [choices, setChoices] = useState(['']);
    const [formErrors, setFormErrors] = useState({});
    const userData = useSelector((state) => state.auth.userData);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const handleBack = () => {
        navigate(-1);
    };

    const handleChangeSubject = (e) => {
        setSubject(e.target.value);
    };

    const handleChangeDescription = (e) => {
        setDescription(e.target.value);
    };

    const handleChangeChoice = (index, value) => {
        const newChoices = [...choices];
        newChoices[index] = value;
        setChoices(newChoices);
    };

    const handleAddChoice = () => {
        setChoices([...choices, '']);
    };

    const handleRemoveChoice = (index) => {
        const newChoices = [...choices];
        newChoices.splice(index, 1);
        setChoices(newChoices);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log({
            deptToken: userData.token,
            subject: subject,
            description: description,
            pollChoices: choices
        })
        if (validateForm()) {
            try {
                setIsLoading(true)

                const response = await axios.post(`${baseUrl}/${apiPrefixV1}/poll/new`, {
                    deptToken: userData.token,
                    subject: subject,
                    description: description,
                    pollChoices: choices
                }, {
                    headers: {
                        Authorization: `Bearer ${userData.accessToken}`
                    }
                });

                const code = response.data.code;
                if (code === 2000) {
                    toast.success("Poll created successfully!", { autoClose: true, position: 'top-right', pauseOnHover: false });
                    setIsLoading(false)
                    navigate(-1);
                }
                else if (code === 2003) {
                    dispatch(logout());
                    toast.info("Login again!", { autoClose: true, position: 'top-right', pauseOnHover: false });
                    navigate('/login');
                }
                else {
                    toast.error("Failed to create poll.", { autoClose: true, position: 'top-right', pauseOnHover: false });
                }
            } catch (error) {
                toast.error("An error occurred while creating the poll.", { autoClose: true, position: 'top-right', pauseOnHover: false });
            }
        }
    };

    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (!subject.trim()) {
            errors.subject = 'Subject is required';
            isValid = false;
        }

        if (!description.trim()) {
            errors.description = 'Description is required';
            isValid = false;
        }

        if (choices.length < 2) {
            errors.choices = 'At least 2 choices are required';
            isValid = false;
        } else if (choices.some(choice => !choice.trim())) {
            errors.choices = 'All choices must be non-empty';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    return (
        <div className="new-poll-container">
            <div className="back-button" onClick={handleBack}>
                <FaIcons.FaArrowLeft />
            </div>
            <div className="new-poll-form">
                <h2>Create New Poll</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="subject">Subject:</label>
                        <input
                            type="text"
                            id="subject"
                            value={subject}
                            onChange={handleChangeSubject}
                        />
                        {formErrors.subject && <span className="error-message">{formErrors.subject}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description:</label>
                        <input
                            type="text"
                            id="description"
                            value={description}
                            onChange={handleChangeDescription}
                        />
                        {formErrors.description && <span className="error-message">{formErrors.description}</span>}
                    </div>

                    <div className="form-group">
                        <label>Choices:</label>
                        {choices.map((choice, index) => (
                            <div key={index} className="choice-input">
                                <input
                                    type="text"
                                    value={choice}
                                    onChange={(e) => handleChangeChoice(index, e.target.value)}
                                />
                                <button type="button" onClick={() => handleRemoveChoice(index)}>-</button>
                            </div>
                        ))}
                        <button type="button" className="add-choice-button" onClick={handleAddChoice}>Add Choice</button>
                        {formErrors.choices && <span className="error-message">{formErrors.choices}</span>}
                    </div>

                    {!isLoading ? <button type="submit" className="submit-button">Create Poll</button> : <LoadingIndicator2 color={'#1f8ba1'} size={40} />}
                </form>
            </div>
        </div>
    );
}

export default NewPollComponent;

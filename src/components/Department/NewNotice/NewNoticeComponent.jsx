import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { baseUrl, apiPrefixV1 } from '../../../constants/AppConstants';
import { logout } from '../../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import './NewNoticeComponent.css';
import {toast} from "react-toastify";
import * as FaIcons from 'react-icons/fa';
function NewNoticeComponent() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector(state => state.auth.userData);

    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [images, setImages] = useState([]);
    const [document, setDocument] = useState(null);
    const [alertInputType, setAlertInputType] = useState('TEXT');
    const [subjectError, setSubjectError] = useState('');
    const [messageError, setMessageError] = useState('');
    const [imagesError, setImagesError] = useState('');
    const [documentError, setDocumentError] = useState('');

    const handleImageChange = (e) => {
        setImages([...images, ...Array.from(e.target.files)]);
    };

    const handleDocumentChange = (e) => {
        setDocument(e.target.files[0]);
    };

    const handleRemoveFile = (type, index) => {
        if (type === 'image') {
            setImages(images.filter((_, i) => i !== index));
        } else {
            setDocument(null);
        }
    };

    const handleFileClick = (fileUrl) => {
        window.open(fileUrl, '_blank');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                let token = null;

                //- Create alert
                const createAlertResponse = await axios.post(`${baseUrl}/${apiPrefixV1}/alert/new`, {
                    departmentToken: userData.token,
                    subject,
                    message: alertInputType === 'TEXT' ? message : null,
                    alertInputType
                },
                    {
                        headers: {
                            Authorization: `Bearer ${userData.accessToken}`
                        }
                    }
                );
                console.log('text save response...')
                console.log(createAlertResponse.data)
                if (createAlertResponse.data.code === 2000) {
                    token = createAlertResponse.data.data;

                    //- Upload images or document based on alertInputType
                    if (alertInputType === 'TEXT' && images.length > 0) {
                        const formData = new FormData();
                        for (let i = 0; i < images.length; i++) {
                            formData.append('images', images[i]);
                        }
                        await axios.post(`${baseUrl}/${apiPrefixV1}/alert/upload/image?token=${token}`, formData, {
                            headers: {
                                Authorization: `Bearer ${userData.accessToken}`
                            }
                        });
                    } else {
                        const formData = new FormData();
                        formData.append('file', document);
                        await axios.post(`${baseUrl}/${apiPrefixV1}/alert/upload/file?token=${token}`, formData, {
                            headers: {
                                Authorization: `Bearer ${userData.accessToken}`
                            }
                        });
                    }

                    navigate(-1);
                    toast.success("Notice uploaded!", { autoClose: true, position: 'top-right', pauseOnHover: false });

                }
                else if (code === 2003) {
                    dispatch(logout());
                    toast.info("Login again!", { autoClose: true, position: 'top-right', pauseOnHover: false });
                    navigate('/login');
                }
                else {
                    toast.error("Failed to create notice.", { autoClose: true, position: 'top-right', pauseOnHover: false });
                }
            } catch (error) {
                console.log(error.message)
                toast.error("An error occurred while creating the notice.", { autoClose: true, position: 'top-right', pauseOnHover: false });
            }
        }
    };

    const validateForm = () => {
        let isValid = true;

        if (!subject.trim()) {
            setSubjectError('Subject is required');
            isValid = false;
        } else {
            setSubjectError('');
        }

        if (alertInputType === 'TEXT' && !message.trim()) {
            setMessageError('Message is required');
            isValid = false;
        } else {
            setMessageError('');
        }


        if (alertInputType === 'DOCUMENT' && !document) {
            setDocumentError('Document is required');
            isValid = false;
        } else {
            setDocumentError('');
        }

        return isValid;
    };

    return (
        <div className="new-notice-container">
            <div className="heading">
                <div className="new-notice-back-buttonn" onClick={() => navigate(-1)}>
                    <FaIcons.FaArrowLeft />
                </div>
                <h2>Create New Notice</h2>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="new-notice-form-group">
                    <label htmlFor="new-notice-subject">Subject:</label>
                    <input type="text" id="new-notice-subject" className={subjectError ? 'error' : ''} value={subject} onChange={(e) => setSubject(e.target.value)} />
                    {subjectError && <span className="error-message">{subjectError}</span>}
                </div>
                {alertInputType === 'TEXT' && (
                    <div className="new-notice-form-group">
                        <label htmlFor="new-notice-message">Message:</label>
                        <textarea id="new-notice-message" className={messageError ? 'error' : ''} value={message} onChange={(e) => setMessage(e.target.value)} ></textarea>
                        {messageError && <span className="error-message">{messageError}</span>}
                    </div>
                )}
                <div className="new-notice-form-group">
                    <label htmlFor="new-notice-file">Upload {alertInputType === 'TEXT' ? 'Images' : 'File'}:</label>
                    <input type="file" id="new-notice-file" onChange={alertInputType === 'TEXT' ? handleImageChange : handleDocumentChange} multiple={alertInputType === 'TEXT'} accept={alertInputType === 'TEXT' ? 'image/*' : '.pdf'} />
                    {alertInputType === 'TEXT' && images.length > 0 && (
                        <div className="uploaded-files">
                            {images.map((image, index) => (
                                <div key={index} className="file-item">
                                    <span onClick={() => handleFileClick(URL.createObjectURL(image))}>{image.name}</span>
                                    <button type="button" onClick={() => handleRemoveFile('image', index)}>X</button>
                                </div>
                            ))}
                        </div>
                    )}
                    {alertInputType === 'DOCUMENT' && document && (
                        <div className="uploaded-files">
                            <div className="file-item">
                                <span onClick={() => handleFileClick(URL.createObjectURL(document))}>{document.name}</span>
                                <button type="button" onClick={() => handleRemoveFile('document')}>X</button>
                            </div>
                        </div>
                    )}
                    {imagesError && <span className="error-message">{imagesError}</span>}
                    {documentError && <span className="error-message">{documentError}</span>}
                </div>
                <div className="new-notice-form-group">
                    <label htmlFor="new-notice-alertInputType">Alert Input Type:</label>
                    <select id="new-notice-alertInputType" value={alertInputType} onChange={(e) => { setAlertInputType(e.target.value); setImages([]); setDocument(null); }}>
                        <option value="TEXT">Text</option>
                        <option value="DOCUMENT">Document</option>
                    </select>
                </div>
                <button className="notice-submit-button" type="submit">Submit</button>
            </form>
        </div>
    );
}

export default NewNoticeComponent;

import React, { useState } from 'react';
import './NewArticleComponent.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../redux/slices/authSlice.js';
import { baseUrl, apiPrefixV1 } from '../../../constants/AppConstants.js';
import { useNavigate } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import LoadingIndicator2 from '../../LoadingIndicator2/LoadingIndicator2.jsx';
import { toast } from 'react-toastify';
import axios from 'axios';
function NewArticleComponent() {
  const navigate = useNavigate()
  const [value, setValue] = useState('');
  const dispatch = useDispatch();
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike"],
      ["align", "blockquote", "code-block"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video"],
    ],
  };


  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [placeholderType, setPlaceholderType] = useState('image'); // Default to image
  const userData = useSelector(state => state.auth.userData)
  const [images, setImages] = useState([])
  const [videos, setVideos] = useState([])


  const MAX_TOTAL_UPLOAD_SIZE = 100 * 1024 * 1024; // 100MB in bytes
  const MAX_FILE_SIZE = 70 * 1024 * 1024; // 10MB in bytes

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalSize = images.reduce((acc, file) => acc + file.size, 0) + files.reduce((acc, file) => acc + file.size, 0);
    if (totalSize <= MAX_TOTAL_UPLOAD_SIZE) {
      const validFiles = files.filter(file => file.size <= MAX_FILE_SIZE);
      if (validFiles.length === files.length) {
        setImages([...images, ...validFiles]);
      } else {
        // Handle error: Some files exceed the maximum file size limit
        toast.error("Some files exceed the maximum file size limit (10MB).", { autoClose: true, position: 'top-right', pauseOnHover: false });
      }
    } else {
      // Handle error: Total upload size exceeds the maximum limit
      toast.error("Total upload size exceeds the maximum limit (100MB).", { autoClose: true, position: 'top-right', pauseOnHover: false });
    }
  };

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    const totalSize = videos.reduce((acc, file) => acc + file.size, 0) + files.reduce((acc, file) => acc + file.size, 0);
    console.log(`total size: ${totalSize} current file size: ${files[0].size}`);

    if (totalSize <= MAX_TOTAL_UPLOAD_SIZE) {
      const validFiles = files.filter(file => file.size <= MAX_FILE_SIZE);
      if (validFiles.length === files.length) {
        setVideos([...videos, ...validFiles]);
      } else {
        // Handle error: Some files exceed the maximum file size limit
        toast.error("Some files exceed the maximum file size limit (10MB).", { autoClose: true, position: 'top-right', pauseOnHover: false });
      }
    } else {
      // Handle error: Total upload size exceeds the maximum limit
      toast.error("Total upload size exceeds the maximum limit (100MB).", { autoClose: true, position: 'top-right', pauseOnHover: false });
    }
  };

  const handleRemoveFile = (type, index) => {
    if (type === 'image') {
      setImages(images.filter((_, i) => i !== index));
    } else {
      setVideos(videos.filter((_, i) => i !== index));
    }
  };

  const handleFileClick = (fileUrl) => {
    window.open(fileUrl, '_blank');
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        setIsLoading(true)

        const response = await axios.post(`${baseUrl}/${apiPrefixV1}/article/new`, {
          departmentToken: userData.token,
          title: title,
          slug: slug,
          content: value
        }, {
          headers: {
            Authorization: `Bearer ${userData.accessToken}`
          }
        });
        console.log('article response... ');
        console.log(response.data);
        let code = response.data.code;
        if (code === 2000) {
          const articleToken = response.data.data;

          if (images.length > 0) {
            code = await uploadImages(articleToken)
          }
          else if (videos) {
            code = await uploadVideos(articleToken)
          }
          toast.success("Article uploaded successfully!", { autoClose: true, position: 'top-right', pauseOnHover: false });

          navigate(-1);
        }
        else if (code === 2003) {
          dispatch(logout());
          toast.info("Login again!", { autoClose: true, position: 'top-right', pauseOnHover: false });
          navigate('/login');
        }
        else {
          toast.error("Failed to save article.", { autoClose: true, position: 'top-right', pauseOnHover: false });
        }
      } catch (error) {
        console.log(error.message);
        toast.error("An error occurred while savign the article.", { autoClose: true, position: 'top-right', pauseOnHover: false });
      }
      finally {
        setIsLoading(false)
      }
    }
  };

  const uploadVideos = async (articleToken) => {
    try {
      const formData = new FormData();
      for (let i = 0; i < videos.length; i++) {
        formData.append('videos', videos[i]);
      }
      const response = await axios.post(`${baseUrl}/${apiPrefixV1}/article/upload/videos?token=${articleToken}`, formData, {
        headers: {
          Authorization: `Bearer ${userData.accessToken}`
        }
      });
      console.log('article video response... ');
      console.log(response.data);
      return response.data.code;
    }
    catch (error) {
      console.log(error.message);
    }
    return -1;
  }

  const uploadImages = async (articleToken) => {
    try {
      const formData = new FormData();
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
      }
      const response = await axios.post(`${baseUrl}/${apiPrefixV1}/article/upload/images?token=${articleToken}`, formData, {
        headers: {
          Authorization: `Bearer ${userData.accessToken}`
        }
      });
      console.log('article image response... ');
      console.log(response.data);
      return response.data.code;
    }
    catch (err) {
      console.log(err.message);
    }
    return -1;
  }

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!title.trim()) {
      errors.title = 'Title is required';
      isValid = false;
    }

    if (!slug.trim()) {
      errors.slug = 'Slug is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  }

  const handleBack = () => {
    navigate(-1);
  }

  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleChangeSlug = (e) => {
    setSlug(e.target.value);
  };

  const handlePlaceholderTypeChange = (e) => {
    setPlaceholderType(e.target.value);
  };

  return (
    <div className="new-article-container">
      <div className="new-article-btn">
        <FaIcons.FaArrowLeft className="new-article-back-icon" onClick={handleBack} />
        {!isLoading ? (
          <button type="submit" className="article-save-btn" onClick={handleSubmit}>
            Save
          </button>
        ) : (
          <LoadingIndicator2 color={'#1f8ba1'} size={40} />
        )}
      </div>
      <div className="row">
        <div className="left">
          <div className="fields">
            <form onSubmit={handleSubmit}>
              <div className="article-form-group">
                <label htmlFor="title">Subject:</label>
                <input
                  type="text"
                  id="subject"
                  value={title}
                  onChange={handleChangeTitle}
                />
                {formErrors.title && (
                  <span className="error-message">{formErrors.title}</span>
                )}
              </div>
              <div className="article-form-group">
                <label htmlFor="slug">Slug:</label>
                <input
                  type="text"
                  id="slug"
                  value={slug}
                  onChange={handleChangeSlug}
                />
                {formErrors.slug && (
                  <span className="error-message">{formErrors.slug}</span>
                )}
              </div>
              <div className="article-form-group upload-sec">
                <label>Upload Placeholder:</label>
                <input type="file" accept={placeholderType === 'image' ? 'image/*' : 'video/*'} onChange={placeholderType === 'image' ? handleImageChange : handleVideoChange} />
              </div>
              <div className="new-article-form-group">
                {placeholderType === 'image' && images.length > 0 && (
                  <div className="article-uploaded-files">
                    {images.map((image, index) => (
                      <div key={index} className="article-file-item">
                        <span onClick={() => handleFileClick(URL.createObjectURL(image))}>{image.name}</span>
                        <button type="button" onClick={() => handleRemoveFile('image', index)}>X</button>
                      </div>
                    ))}
                  </div>
                )}
                {placeholderType === 'video' && videos.length > 0 && (
                  <div className="article-uploaded-files">
                    {videos.map((video, index) => (
                      <div key={index} className="article-file-item">
                        <span onClick={() => handleFileClick(URL.createObjectURL(video))}>{video.name}</span>
                        <button type="button" onClick={() => handleRemoveFile('video', index)}>X</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="article-form-group ">
                <label>Select Placeholder Type:</label>
                <div className="image-radio">
                  <label>
                    Image
                  </label>
                  <input
                    type="radio"
                    value="image"
                    checked={placeholderType === 'image'}
                    onChange={handlePlaceholderTypeChange}
                  />
                </div>
                <div className="video-radio">
                  <label>
                    Video
                  </label>
                  <input
                    type="radio"
                    value="video"
                    checked={placeholderType === 'video'}
                    onChange={handlePlaceholderTypeChange}
                  />
                </div>
              </div>

            </form>
          </div>
          <div className="editor">
            <ReactQuill
              theme="snow"
              value={value}
              onChange={setValue}
              className="editor-input"
              modules={modules}
            />
          </div>
        </div>
        <div className="preview">
          <div dangerouslySetInnerHTML={{ __html: value }}></div>
        </div>
      </div>
    </div>
  );
}

export default NewArticleComponent;

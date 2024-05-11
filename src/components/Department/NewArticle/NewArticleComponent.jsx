import React, { useState } from 'react';
import './NewArticleComponent.css';

import 'react-quill/dist/quill.snow.css';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../redux/slices/authSlice.js';
import { baseUrl, apiPrefixV1 } from '../../../constants/AppConstants.js';
import { useNavigate } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import LoadingIndicator2 from '../../LoadingIndicator2/LoadingIndicator2.jsx';
import { toast } from 'react-toastify';
import axios from 'axios';
import ArticleForm from '../ArticleForm/ArticleForm.jsx';
function NewArticleComponent() {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [content, setContent] = useState('');


  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [placeholderType, setPlaceholderType] = useState('image'); // Default to image
  const userData = useSelector(state => state.auth.userData)
  const [images, setImages] = useState([])
  const [videos, setVideos] = useState([])
  const [description, setDescription] = useState('');


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




  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        setIsLoading(true)

        const response = await axios.post(`${baseUrl}/${apiPrefixV1}/article/new`, {
          departmentToken: userData.token,
          title: title,
          slug: slug,
          description: description,
          content: content
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
        toast.error("An error occurred while saving the article.", { autoClose: true, position: 'top-right', pauseOnHover: false });
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

    if(!description.trim()) {
      errors.description='Description is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  }

  const handleBack = () => {
    navigate(-1);
  }

  const handleChangeDescription = (e) => {
    setDescription(e.target.value);
  }


  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleChangeSlug = (e) => {
    setSlug(e.target.value);
  };

  const handlePlaceholderTypeChange = (e) => {
    setPlaceholderType(e.target.value);
    setVideos([]);
    setImages([]);
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

      <ArticleForm
        title={title}
        slug={slug}
        description={description}
        placeholderType={placeholderType}
        formErrors={formErrors}
        handlePlaceholderTypeChange={handlePlaceholderTypeChange}
        handleChangeTitle={handleChangeTitle}
        handleChangeSlug={handleChangeSlug}
        handleChangeDescription={handleChangeDescription}
        handleRemoveFile={handleRemoveFile}
        handleImageChange={handleImageChange}
        handleVideoChange={handleVideoChange}
        handleSubmit={handleSubmit}
        images={images}
        videos={videos}
        value={content}
        setValue={setContent}
        uploadMessage="Only one media type is allowed-image or video"
      />
    </div>
  );
}

export default NewArticleComponent;

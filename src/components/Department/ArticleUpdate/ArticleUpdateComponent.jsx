import React, { useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../redux/slices/authSlice.js';
import { baseUrl, apiPrefixV1 } from '../../../constants/AppConstants.js';
import { useNavigate, useParams } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import LoadingIndicator2 from '../../LoadingIndicator2/LoadingIndicator2.jsx';
import { toast } from 'react-toastify';
import axios from 'axios';
import './ArticleUpdateComponent.css';
import Slider from 'react-slick';
import * as ImIcons from 'react-icons/im';
import LazyLoad from 'react-lazy-load';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArticleForm from '../ArticleForm/ArticleForm.jsx';
function ArticleUpdateComponent() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userData = useSelector(state => state.auth.userData);
    const [currentMedia, setCurrentMedia] = useState(null);
    const { articleToken } = useParams();
    const [removedMedia, setRemovedMedia] = useState([]);
    const [articleTitle, setArticleTitle] = useState('');
    const [description, setDescription] = useState('');
    const [articleContent, setArticleContent] = useState('');
    const [slug, setArticleSlug] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [placeholderType, setPlaceholderType] = useState('');
    const [images, setImages] = useState([])
    const [videos, setVideos] = useState([])
    const [currentMediaType, setCurrentMediaType] = useState('')
    const MAX_TOTAL_UPLOAD_SIZE = 100 * 1024 * 1024; // 100MB in bytes
    const MAX_FILE_SIZE = 70 * 1024 * 1024; // 10MB in bytes
    const fetchArticleDetails = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                `${baseUrl}/${apiPrefixV1}/article/details?token=${articleToken}`,
                {
                    headers: {
                        Authorization: `Bearer ${userData.accessToken}`,
                    },
                }
            );
            const code = response.data.code;
            if (code === 2000) {
                setCurrentMedia(response.data.data.articleMedia);
                setArticleContent(response.data.data.content);
                setArticleTitle(response.data.data.title);
                setArticleSlug(response.data.data.slug);
                setDescription(response.data.data.description)
                setPlaceholderType(response.data.data.articleMedia[0].mediaType.toLowerCase()) //IMAGE or VIDEO
                if (response.data.data.articleMedia.length > 0) {
                    setCurrentMediaType((response.data.data.articleMedia[0].mediaType)) //image or video
                }
            } else if (code === 2003) {
                console.log('token expired!');
                toast.info('Login again!', { autoClose: true, position: 'top-right', pauseOnHover: false });
                dispatch(logout());
                navigate('/login');
            } else {
                toast.error('Failed to fetch data!', { autoClose: true, position: 'top-right', pauseOnHover: false });
            }
        } catch (error) {
            toast.error('Some error occurred!', { autoClose: true, position: 'top-right', pauseOnHover: false });
            console.log(error.message);
        } finally {
            setIsLoading(false);
        }
    };


    const handleRemove = (media) => {
        setRemovedMedia([...removedMedia, media]);
        const updatedMedia = currentMedia.filter(item => item.mediaToken !== media.mediaToken);
        setCurrentMedia(updatedMedia);
    };

    const handleAdd = (media) => {
        const updatedRemovedMedia = removedMedia.filter(item => item.mediaToken !== media.mediaToken);
        setRemovedMedia(updatedRemovedMedia);
        setCurrentMedia([...currentMedia, media]);
    };

    useEffect(() => {
        fetchArticleDetails();
    }, []);

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

    const handleChangeDescription = (e) => {
        setDescription(e.target.value);
    }



    const handleUpdate = async () => {
        if (validateForm()) {
            try {
                setIsLoading(true);

                let isMediaTypeChanged = false;

                //-if current media type and selected type is not same
                if (placeholderType.toLowerCase() !== currentMediaType.toLowerCase().toLowerCase()) {
                    //-if multiple files have been selected
                    if ((videos.length > 0 && currentMediaType.toLowerCase() === "image") || (images.length > 0 && currentMediaType.toLowerCase() === "video")) {
                        isMediaTypeChanged = true;
                    }
                }

                let imageTokens = [];
                let videoTokens = [];

                //-if media type is not changed but some files have been selected for removal
                if (!isMediaTypeChanged) {
                    if (currentMediaType.toLowerCase() === "image") {
                        removedMedia.map(media => imageTokens.push(media.mediaToken));
                    } else if (currentMediaType.toLowerCase() === "video") {
                        removedMedia.map(media => videoTokens.push(media.mediaToken));
                    }
                }

                const response = await axios.put(`${baseUrl}/${apiPrefixV1}/article/update`, {
                    articleToken: articleToken,
                    title: articleTitle,
                    content: articleContent,
                    slug: slug,
                    description: description,
                    imageTokens: imageTokens,
                    videoTokens: videoTokens,
                    isMediaTypeChanged: isMediaTypeChanged
                }, {
                    headers: {
                        Authorization: `Bearer ${userData.accessToken}`
                    }
                });

                console.log(response.data);
                let code = response.data.code;
                if (code === 2000) {
                    const articleToken = response.data.data;

                    if (images.length > 0) {
                        code = await uploadImages(articleToken);
                    } else if (videos.length > 0) {
                        code = await uploadVideos(articleToken);
                    }

                    toast.success("Article uploaded successfully!", { autoClose: true, position: 'top-right', pauseOnHover: false });

                    navigate(-1);
                } else if (code === 2003) {
                    dispatch(logout());
                    toast.info("Login again!", { autoClose: true, position: 'top-right', pauseOnHover: false });
                    navigate('/login');
                } else {
                    toast.error("Failed to save article.", { autoClose: true, position: 'top-right', pauseOnHover: false });
                }
            } catch (error) {
                console.log(error.message);
                toast.error("An error occurred while saving the article.", { autoClose: true, position: 'top-right', pauseOnHover: false });
            } finally {
                setIsLoading(false);
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

        if (!articleTitle.trim()) {
            errors.title = 'Title is required';
            isValid = false;
        }

        if (!slug.trim()) {
            errors.slug = 'Slug is required';
            isValid = false;
        }

        if (!description.trim()) {
            errors.description = 'Description is required';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    }

    if (isLoading) {
        return <div className="loading"><LoadingIndicator2 color="#36d7b7" size={50} /></div>;
    }

    return (
        <div className="u-details-container">
            <div className="u-button-row">
                <FaIcons.FaArrowLeft className='back-arrow' onClick={() => navigate(-1)} />
                <button className='u-article-save-button' onClick={handleUpdate}>Save</button>
            </div>
            <div className="u-media-container">
                {currentMedia && currentMedia.length > 0 && (
                    <Slider {...sliderSettings}>
                        {currentMedia.map(media => (
                            <LazyLoad height={300} key={media.mediaToken}>
                                {media.mediaType === 'VIDEO' ? (
                                    <div key={media.mediaToken} className="u-media-item-video">
                                        <video className='u-media-file-video' controls>
                                            <source src={media.url} type={media.format} />
                                        </video>
                                        <ImIcons.ImCross className='u-remove-button' onClick={() => handleRemove(media)} />
                                    </div>
                                ) : (
                                    <div key={media.mediaToken} className="u-media-item-image">
                                        <img className='u-media-file-image' src={media.url} alt={media.fileName} />
                                        <ImIcons.ImCross className='u-remove-button' onClick={() => handleRemove(media)} />
                                    </div>
                                )}
                            </LazyLoad>
                        ))}
                    </Slider>
                )}
            </div>
            {removedMedia != null && removedMedia.length > 0 && (
                <div className="u-removed-files">
                    <h3>Removed Media</h3>
                    <ul>
                        {removedMedia.map(media => (
                            <li key={media.mediaToken} className="removed-media-item">
                                <div className="removed-media-info">
                                    <p>{media.fileName}</p>
                                    {media.mediaType === 'IMAGE' ? (
                                        <img className='removed-media-preview' src={media.url} alt={media.fileName} />
                                    ) : (
                                        <img className='removed-media-preview' src={`${media.url.split('.').slice(0, -1).join('.')}.jpg`} alt="Video Thumbnail" />
                                    )}
                                </div>
                                <button onClick={() => handleAdd(media)}>Add</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {articleContent && <div className="u-article-container">
                <ArticleForm
                    title={articleTitle}
                    description={description}
                    slug={slug}
                    placeholderType={placeholderType}
                    formErrors={formErrors}
                    handlePlaceholderTypeChange={handlePlaceholderTypeChange}
                    handleChangeTitle={handleChangeTitle}
                    handleChangeDescription={handleChangeDescription}
                    handleChangeSlug={handleChangeSlug}
                    handleRemoveFile={handleRemoveFile}
                    handleImageChange={handleImageChange}
                    handleVideoChange={handleVideoChange}
                    handleSubmit={handleUpdate}
                    images={images}
                    videos={videos}
                    value={articleContent}
                    setValue={setArticleContent}
                    uploadMessage="Only video or image media type is allowed-Selecting other media type and choosing one or more files will delete older files"

                />
            </div>}
        </div >
    );
}

const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
};

export default ArticleUpdateComponent;

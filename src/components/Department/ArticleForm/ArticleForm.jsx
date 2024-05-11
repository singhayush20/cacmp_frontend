import React from 'react'
import ReactQuill from 'react-quill';
import './ArticleForm.css';
function ArticleForm({
    title,
    slug,
    description,
    placeholderType,
    formErrors,
    handlePlaceholderTypeChange,
    handleChangeTitle,
    handleChangeSlug,
    handleChangeDescription,
    images,
    videos,
    handleImageChange,
    handleVideoChange,
    handleSubmit,
    handleRemoveFile,
    value,
    setValue,
    uploadMessage }) {
    const handleFileClick = (fileUrl) => {
        window.open(fileUrl, '_blank');
    };


    return (
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
                            <label className="block text-black font-bold mb-2" htmlFor="message">Message</label>
                            <textarea className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500" id="message" name="message" rows="4" value={description} onChange={handleChangeDescription}></textarea>
                            {formErrors.description && (
                                <span className="error-message">{formErrors.description}</span>
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
                            <p>{uploadMessage}</p>
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
                <div dangerouslySetInnerHTML={{ __html: value }} />
            </div>
        </div>
    )
}


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

export default ArticleForm
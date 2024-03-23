import React, { useState, useEffect } from 'react';
import './ArticleListComponent.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoadingIndicator2 from '../../LoadingIndicator2/LoadingIndicator2.jsx';
import { baseUrl, apiPrefixV1 } from '../../../constants/AppConstants.js';
import { Link } from 'react-router-dom';
import { logout } from '../../../redux/slices/authSlice.js';
import { toast } from 'react-toastify';
function ArticleListComponent() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector(state => state.auth.userData);
    const [isLoading, setIsLoading] = useState(false);
    const [articles, setArticles] = useState([]);
    const [filter, setFilter] = useState({
        publishStatus: '',
        sortBy: 'createdAt'
    });

    useEffect(() => {
        loadArticles();
    }, []);

    const loadArticles = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/${apiPrefixV1}/article/list`, {
                params: {
                    token: userData.token,
                    publishStatus: (filter.publishStatus.length === 0 ? null : filter.publishStatus),
                    sortBy: filter.sortBy
                },
                headers: {
                    Authorization: `Bearer ${userData.accessToken}`,
                },
            });
            const code = response.data.code;
            if (code === 2000) {
                setArticles(response.data.data);

            }
            else if (code === 2003) {
                console.log('token expired!');
                toast.info("Login again!", { autoClose: true, position: 'top-right', pauseOnHover: false });
                dispatch(logout());
                navigate('/login');
            }
            else {
                console.error("Failed to load articles:", response.data.message);
            }
        } catch (error) {
            console.log(error.message)
            console.error("Some error occurred while loading articles:", error.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (index) => {
        setIsLoading(true);
        try {
            const response = await axios.put(`${baseUrl}/${apiPrefixV1}/article/change-status`,
                {
                    token: articles[index]['articleToken'],
                    publishStatus: (articles[index]['publishStatus'] === "DRAFT") ? "PUBLISHED" : "DRAFT"
                },
                {
                    headers: {
                        Authorization: `Bearer ${userData.accessToken}`,
                    },
                });
            const code = response.data.code;
            if (code === 2000) {
                // setArticles(response.data.data);
                loadArticles();
            } else if (code === 2003) {
                console.log('token expired!');
                toast.info("Login again!", { autoClose: true, position: 'top-right', pauseOnHover: false });
                dispatch(logout());
                navigate('/login');
            } else {
                toast.error("Failed to update status!", { autoClose: true, position: 'top-right', pauseOnHover: false });
            }
        } catch (error) {
            toast.error("Some error occurred!", { autoClose: true, position: 'top-right', pauseOnHover: false });
            console.log(error.message);
        }
        finally {
            setIsLoading(false);
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilter(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    const handleDelete = () => {

    }

    return (
        <div className="articles-container">
            <div className="articles">
                <h2>Articles</h2>
                <button className='article-new-button' onClick={() => navigate("/dashboard/article/new")}>Create new</button>
            </div>
            <div className="articles-filter-section">
                <div className="article-filter-column">
                    <label>Publish Status:</label>
                    <select
                        name="publishStatus"
                        value={filter.publishStatus}
                        onChange={handleInputChange}
                    >
                        <option value="">All</option>
                        <option value="DRAFT">Draft</option>
                        <option value="PUBLISHED">Published</option>
                    </select>
                </div>
                <div className="article-filter-column">
                    <label>Sort By:</label>
                    <select
                        name="sortBy"
                        value={filter.sortBy}
                        onChange={handleInputChange}
                    >
                        <option value="createdAt">Created At</option>
                        <option value="updatedAt">Updated At</option>
                    </select>
                </div>
            </div>
            <button className="article-search-button" onClick={loadArticles}>Search</button>
            {isLoading ? (
                <div className="loading"><LoadingIndicator2 color="#36d7b7" size={50} /></div>
            ) : (
                articles.length > 0 ? (
                    <div className="article-table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Created On</th>
                                    <th>Publish On</th>
                                    <th>Delete</th>
                                    <th>Publish</th>
                                </tr>
                            </thead>
                            <tbody>
                                {articles.map((article, index) => (
                                    <tr key={article.articleToken}>
                                        <td><Link to={`/dashboard/article/${article.articleToken}`} className='article-details-link'>{article.title}</Link></td>
                                        <td>{article.createdOn ? new Date(article.createdOn).toLocaleString() : '------------------'}</td>
                                        <td>{article.publishedOn ? new Date(article.publishedOn).toLocaleString() : '------------------'}</td>
                                        <td><button className='article-delete-button' onClick={handleDelete}>Delete</button></td>
                                        <td><button className='article-delete-button' onClick={() => handleStatusUpdate(index)}>{article.publishStatus === 'DRAFT' ? 'Publish' : 'Un-publish'}</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="no-data">
                        <p>No articles found</p>
                    </div>
                )
            )}
        </div>
    );
}

export default ArticleListComponent;

import React from 'react';
import './ArticleListComponent.css'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../redux/slices/authSlice';
import { baseUrl, apiPrefixV1 } from '../../../constants/AppConstants';
function ArticleListComponent(props) {
    const navigate = useNavigate();
    return (
        <div className="articles-container">
            <div className="articles">
                <h2>Articles</h2>
                <button className='article-new-button' onClick={() => navigate("/dashboard/article/new")}>Create new</button>
            </div>
        </div>
    );
}

export default ArticleListComponent;
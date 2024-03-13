
import React from 'react';
import './FeedbackModal.css';
import * as AiIcons from 'react-icons/ai';

function FeedbackDialog({ onClose, feedbackData }) {

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= parseInt(feedbackData.feedbackRating)) {
                stars.push(<AiIcons.AiFillStar key={i} className="star-icon filled" />);
            } else {
                stars.push(<AiIcons.AiOutlineStar key={i} className="star-icon" />);
            }
        }
        return stars;
    };

    return (
        <div className="feedback-modal-overlay">
            <div className="feedback-modal">
                <div className="modal-header">
                    <h2>Feedback</h2>
                    <button className="close-btn" onClick={onClose}>
                        <AiIcons.AiOutlineClose />
                    </button>
                </div>
                <div className="modal-content">
                    <div className="rating">
                        <span className="rating-label">Rating:</span>
                        <div className="stars">{renderStars()}</div>
                    </div>
                    <div className="description">
                        <span className="description-label">Description:</span>
                        <p>{feedbackData.feedbackDescription}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FeedbackDialog;

import { Star, Tag, MessageCircle, ArrowRight } from 'lucide-react';

import shelvestyle from "../styles/shelvestyle.module.css"
import { NavLink } from 'react-router-dom';


const ReviewerComponent = () => {
    return (
        <div className={shelvestyle.reviewerComponentMainContainer}>
            <div className={shelvestyle.emptyShelfWrapper}>
                <div className={shelvestyle.reviewerComponentHeader}>
                    <h2>Get Started</h2>
                    <p>Become a reviewer</p>
                </div>
                <div className={shelvestyle.middleWrapper}>
                    <p style={{display:"flex", columnGap:"2rem"}}><Star size={48} /> <Tag size={48} /> <MessageCircle size={48} /></p>
                    <h2>Creat and Contribute</h2>
                    <p>Write reviews, rate titles, add tags and comments, create recommendation, and more...</p>
                </div>
                <div className={shelvestyle.buttonWrapper}>
                    <NavLink>
                        <button> Register <ArrowRight /></button>
                    </NavLink>
                </div>
            </div>
            
        </div>
    )
}

export default ReviewerComponent
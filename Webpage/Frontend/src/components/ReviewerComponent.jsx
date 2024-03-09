import { Star, Tag, MessageCircle, ArrowRight, Heart, Glasses, BookImage } from 'lucide-react';

import shelvestyle from "../styles/shelvestyle.module.css"
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from "axios"
import Cookies from 'js-cookie';
import { useAuth } from './AuthContext';

import Rating from './Rating';


const ReviewerComponent = () => {

    const {user} = useAuth()

    const [member, setMember] = useState("")
    const [formDataInput, setFormDataInput] = useState({
        reviewinput: "",
        recommendatoin: "",
        currentlyreading: "",
        booksearch: "",
        rating: ""
    })

    const [recommendationCheckBox, setRecommendationCheckBox] = useState({ recommendation: false });
    const [currentlyreadingCheckBox, setCurrentlyreadingCheckBox] = useState({ currentlyreading: false })

    const handleHeartColorAndInput = (e, description) => {
        const { name, value, checked } = e.target;
    
        if (e.target.type === "checkbox") {
            if(name === "recommendation") {
                setRecommendationCheckBox((prev) => ({
                    ...prev,
                    [name]: checked,
                    [name + "_description"]: checked ? description : 'no', 
                }));
            } else if (name === "currentlyreading") {
                setCurrentlyreadingCheckBox((prev) => ({
                    ...prev,
                    [name]: checked,
                    [name + "_discription"]: checked ? description : 'no'
                }))
            }
            
        } else {
            setFormDataInput((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    }
    
    

    axios.defaults.withCredentials = true
    useEffect(() => {
        const fetchUserData = async () => {
            if(!user) return

            try {
                const token = Cookies.get("token")
                const response = await axios.get("http://localhost:3001/libraryusers", {
                    headers: {"Content-Type": "application/json", "Authorization": `Bearer${token}`}
                })

                response.data.valid ? setMember(response.data) : console.error("Error fetching user", response.data)

            } catch (error) {
                console.error("Error fetching user data from database", error)
            }
        }

        fetchUserData()

    }, [user])

    console.log("member", member)

    return (
        <div className={shelvestyle.reviewerComponentMainContainer}>

            {member && member.user && member.user.reviewer === !true ? (
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
            ): (
                <form>
                    <fieldset>
                        <div className={shelvestyle.userNameAndTextInputContainer}>
                            {member && member.user.userName && (<h2>{member.user.userName}</h2>)}
                            <label htmlFor="ReviewInput"></label>
                            <textarea name="reviewinput" id="ReviewInput" cols="30" rows="10" placeholder='Write A Review'></textarea>
                        </div>
                        <div className={shelvestyle.recommendationAndCurrentlyReadingContainer}>
                            <label htmlFor="Recommendation">
                                <Heart size={20} fill={recommendationCheckBox.recommendation ? "red" : "white"} className={shelvestyle.heart}  /> Recommendation
                                <input type="checkbox" name='recommendation' id='Recommendation' checked={recommendationCheckBox.recommendedyes} onChange={(e) => handleHeartColorAndInput(e, "yes")} />
                            </label>

                            <label htmlFor="CurrentlyReading">
                                <Glasses size={20} fill={currentlyreadingCheckBox.currentlyreading ? "blue" : "white"} className={shelvestyle.glasses}/> Currently Reading
                                <input type="checkbox" name='currentlyreading' id='CurrentlyReading' checked={currentlyreadingCheckBox.currentlyreadingyes} onChange={(e) => handleHeartColorAndInput(e, "yes")} />
                            </label>
                        </div>
                    </fieldset>
                    <fieldset className={shelvestyle.secoundFieldSetWrapper}>
                        <div className={shelvestyle.bookImageWrapper}>
                            <BookImage size={100}/>
                        </div>
                        <div className={shelvestyle.ratingStarAndSearchBookContainer}>
                            <p>Search book to review</p>
                            <label htmlFor="BookSearch"></label>
                            <input type="text" name='booksearch' id='BookSearch' />
                            <div className={shelvestyle.ratingStarContainer}>
                                <div className={shelvestyle.mainStarContainer}>
                                    <div className={shelvestyle.starWrapper}>                                        
                                        <Rating />
                                    </div>
                                </div>
                                <p>Add a rating</p>                          
                            </div>
                        </div>
                    </fieldset>

                    <div className={shelvestyle.reviewButtonWrapper}>
                        <button type='submit'> Submit</button>
                    </div>

                </form>
            )}

        </div>
    )
}

export default ReviewerComponent
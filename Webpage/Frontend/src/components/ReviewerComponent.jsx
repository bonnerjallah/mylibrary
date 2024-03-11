import { Star, Tag, MessageCircle, ArrowRight, Heart, Glasses, BookImage, Search } from 'lucide-react';

import shelvestyle from "../styles/shelvestyle.module.css"
import { NavLink } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import axios from "axios"
import Cookies from 'js-cookie';
import { useAuth } from './AuthContext';

import Rating from './Rating';
import ReviewerRequestModal from './ReviewerRequestModal';


const ReviewerComponent = () => {

    const {user} = useAuth()

    const [member, setMember] = useState("")
    const [allBooks, setAllBooks] = useState([])
    const [filterBookData, setFilterBookData] = useState('')
    const [searchTitle, setSearchTitle] = useState('')
    const [recommendationCheckBox, setRecommendationCheckBox] = useState({ recommend: false });
    const [currentlyreadingCheckBox, setCurrentlyreadingCheckBox] = useState({ currentlyreading: false })
    const [parentRating, setParentRating] = useState(null)
    const [review, setreview] = useState({
        review: "",
    })

    //User Error Message display
    const [alreadyReviewedErrorMsg, setalreadyReviewedErrorMsg] = useState('')
    const [genericErrorMsg, setGenericErrorMsg] = useState('')

    //Module State
    const [showModal, setShowModal] = useState(false)

    //Function to handle module
    const handleModule = () => {
        setShowModal(true)
    }

    //Function to handle review state
    const handleReviewInput = (e) => {
        const {name, value} = e.target 
        setreview((prev) => ({...prev, [name]: value}))
    }
    
    //Function to handle checkbox state
    const handleColorAndInput = (e, description) => {
        const { name, checked } = e.target;
    
        if (e.target.type === "checkbox") {
            if (name === "recommend") {
                setRecommendationCheckBox((prev) => ({
                    ...prev,
                    [name]: checked,
                    [name + "_description"]: checked ? description : 'false', 
                }));
            } else if (name === "currentlyreading") {
                setCurrentlyreadingCheckBox((prev) => ({
                    ...prev,
                    [name]: checked,
                    [name + "_description"]: checked ? description : 'false'
                }))
            }      
        } 
    }
    
    //Function for search book title
    const handleBookSearch = () => {
        const filterBook = allBooks.filter(book => {
            return book.bookTitle.toLowerCase().includes(searchTitle.toLowerCase());
        });
    
        setFilterBookData(filterBook);
    };

    //callback function to handle Rating change
    const handleRatingChange = useCallback((newRating) => {
        setParentRating(newRating)
    }, [])
    

    //Function to handle review submit
    const handleReviewerFromInputData = async (e, _id) => {
        e.preventDefault()

        const formData = new FormData()

        formData.append("review", review.review);

        filterBookData.map((elem) => {
            formData.append("bookId", elem._id)
        })

        formData.append("rating", parentRating);

        const recommended = recommendationCheckBox.recommend ? "Yes" : (recommendationCheckBox.recommend ? "No" : "");
        formData.append("recommend", recommended)

        const readingCurrently = currentlyreadingCheckBox.currentlyreading ? "Yes" : (currentlyreadingCheckBox.currentlyreading ? "No" : "")
        formData.append("currentlyreading", readingCurrently)

        formData.append("userid", member.user.id);

        try {
            const response = await axios.post("http://localhost:3001/reviewerinput", formData, {
                headers:{"Content-Type": "application/json"}
            })

            if(response.status === 200) {
                console.log("Inserted reviewer data successfully")

                setFilterBookData("")
                setSearchTitle("")
                setRecommendationCheckBox("")
                setCurrentlyreadingCheckBox("")
                setParentRating("")
                setreview({
                    review: ""
                })


            } else {
                console.log("error inserting reviewer data to database", error)
            }

            
        } catch (error) {
            console.log("Error inserting data", error)
            if (error.response && error.response.data && error.response.data.message === "Already reviewed this book") {
                setalreadyReviewedErrorMsg(error.response.data.message);

                setTimeout(() => {
                    setalreadyReviewedErrorMsg('');
                    
                }, 5000);
            } else {
                if(error.response && error.response.data) {
                    setGenericErrorMsg("An error occurred. Please try again.");

                    setTimeout(() => {
                        setGenericErrorMsg('')
                    }, 5000)
                }
            }
        }
    }

    //Fetching user data
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

    //Fetching books data
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const catalogBooksResponse = await axios.get("http://localhost:3001/catalogbooks")
                const booksInCatalog = catalogBooksResponse.data

                const formatedCatalogBookData = booksInCatalog.map((elem) => {
                    const originalDate = new Date (elem.booksPublishDate)
                    const formattedDate = originalDate.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: '2-digit'
                    })

                    elem.booksPublishDate = formattedDate
                    return elem
                })

                const suggestionsBookResponse = await axios.get("http://localhost:3001/suggestedBooks")
                const booksInSuggestions = suggestionsBookResponse.data

                const formatedBookSuggestionsData = booksInSuggestions.map((suggestElem) => {
                    const suggestionOriginalDate = new Date (suggestElem.booksPublishDate)
                    const formattedSuggDate = suggestionOriginalDate.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit"
                    })

                    suggestElem.booksPublishDate = formattedSuggDate
                    return suggestElem
                })


                const combineBooks = [...formatedCatalogBookData, ...formatedBookSuggestionsData]
                setAllBooks(combineBooks)

            } catch (error) {
                console.log("Error fetching books", error)
            }
        }
        fetchBooks()
    }, [])

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
                        <button onClick={handleModule}> Register <ArrowRight /></button>
                    </div>
                    {showModal && (< ReviewerRequestModal memberId={member.user.id} closeModal={setShowModal} />)}
                </div> 
            ): (
                <form onSubmit={handleReviewerFromInputData} encType='multipart/form-data' method='POST'>
                    <fieldset>
                        <div className={shelvestyle.userNameAndTextInputContainer}>
                            {member && member.user.userName && (<h2>{member.user.userName}</h2>)}
                            <label htmlFor="ReviewInput"></label>
                            <textarea name="review" id="ReviewInput" cols="30" rows="10" placeholder='Write A Review' value={review.review} onChange={handleReviewInput}></textarea>
                        </div>
                        <div className={shelvestyle.recommendationAndCurrentlyReadingContainer}>
                            <label htmlFor="Recommendation">
                                <Heart size={20} fill={recommendationCheckBox.recommend ? "red" : "white"} className={shelvestyle.heart}  /> Recommend
                                <input type="checkbox" name='recommend' id='Recommendation' checked={recommendationCheckBox.recommend} onChange={(e) => handleColorAndInput(e, "Yes")} />
                            </label>

                            <label htmlFor="CurrentlyReading">
                                <Glasses size={20} fill={currentlyreadingCheckBox.currentlyreading ? "blue" : "white"} className={shelvestyle.glasses}/> Currently Reading
                                <input type="checkbox" name='currentlyreading' id='CurrentlyReading' checked={currentlyreadingCheckBox.currentlyreading} onChange={(e) => handleColorAndInput(e, "Yes")} />
                            </label>
                        </div>
                    </fieldset>
                    <fieldset className={shelvestyle.secoundFieldSetWrapper}>
                        <div className={shelvestyle.bookImageWrapper}>
                            {filterBookData && filterBookData.length > 0 ? (
                                <div style={{padding:".5rem .5rem", display:'flex', justifyContent:"center"}}>
                                    <img src={`http://localhost:3001/booksimages/${filterBookData[0].bookImageUrl}`} alt=" book Image" width="80" height="90" />
                                </div>
                            ) : (
                                <BookImage size={100}/>
                            )}
                        </div>
                        <div className={shelvestyle.ratingStarAndSearchBookContainer}>
                            <p>Search by title to review</p>
                            <label htmlFor="BookSearch"></label>
                            <div style={{display:"flex"}}>
                                <input type="text" name='booksearch' id='BookSearch' value={searchTitle} onChange={(e) => setSearchTitle(e.target.value)} />
                                <div className={shelvestyle.searchIconWrapper} onClick={handleBookSearch}>
                                    <Search />
                                </div>
                            </div>
                            <div className={shelvestyle.ratingStarContainer}>
                                <div className={shelvestyle.mainStarContainer}>
                                    <div className={shelvestyle.starWrapper}>                                        
                                        <Rating onRatingChange={handleRatingChange} />
                                    </div>
                                </div>
                                <p>Add a rating</p>                          
                            </div>
                        </div>
                    </fieldset>

                    <div className={shelvestyle.reviewButtonWrapper}>
                        <button type='submit'> Submit</button>
                    </div>
                    {alreadyReviewedErrorMsg && (<p style={{color:"red", fontSize:"2rem", zIndex:"9999", margin:"1rem 0 1rem 2rem "}}>{alreadyReviewedErrorMsg}</p>)}
                    {genericErrorMsg && (<p style={{color:"red", fontSize:"2rem", zIndex:"9999", margin:"1rem 0 1rem 2rem "}}>{genericErrorMsg}</p>)}

                </form>
            )}

        </div>
    )
}

export default ReviewerComponent
import { Star, Tag, MessageCircle, ArrowRight, Heart, Glasses, BookImage, Search } from 'lucide-react';

import shelvestyle from "../styles/shelvestyle.module.css"
import { NavLink } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
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

    const [allBooks, setAllBooks] = useState([])
    const [searchTitle, setSearchTitle] = useState('')
    const [filterBookData, setFilterBookData] = useState([])
    const [recommendationCheckBox, setRecommendationCheckBox] = useState({ recommendation: false });
    const [currentlyreadingCheckBox, setCurrentlyreadingCheckBox] = useState({ currentlyreading: false })
    const [parentRating, setParentRating] = useState(null)

    const handleColorAndInput = (e, description) => {
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

    console.log(allBooks)


    //callback function to handle Rating change
    const handleRatingChange = useCallback((newRating) => {
        setParentRating(newRating)
    }, [])

    //Search book title
    const handleBookSearch = (e) => {
        e.preventDefault()
        const  filterBook = allBooks.filter(book => {
            return book.bookTitle.toLowerCase().includes(searchTitle.toLowerCase())
        })
        setFilterBookData(filterBook)
    }




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
                                <Heart size={20} fill={recommendationCheckBox.recommendation ? "red" : "white"} className={shelvestyle.heart}  /> Recommend
                                <input type="checkbox" name='recommendation' id='Recommendation' checked={recommendationCheckBox.recommendation} onChange={(e) => handleColorAndInput(e, "yes")} />
                            </label>

                            <label htmlFor="CurrentlyReading">
                                <Glasses size={20} fill={currentlyreadingCheckBox.currentlyreading ? "blue" : "white"} className={shelvestyle.glasses}/> Currently Reading
                                <input type="checkbox" name='currentlyreading' id='CurrentlyReading' checked={currentlyreadingCheckBox.currentlyreading} onChange={(e) => handleColorAndInput(e, "yes")} />
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

                </form>
            )}

        </div>
    )
}

export default ReviewerComponent
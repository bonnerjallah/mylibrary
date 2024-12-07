import { useState, useEffect } from "react"
import { useAuth } from "../components/AuthContext"
import Cookies from "js-cookie"
import axios from "axios"
import { NavLink, useParams } from "react-router-dom"
import { Bookmark, Star, ChevronDown, ChevronUp, MoveLeft, StarHalf } from "lucide-react"
import bookdetailsstyle from "../styles/bookdetailsstyle.module.css"

import Fotter from "../components/Footer"

const backEndUrl = import.meta.env.VITE_BACKEND_URL


const BookDetails = () => {

    const {_id} = useParams()
    const {user} = useAuth()

    const [member, setMember] = useState('')
    const [allBooks, setAllBooks] = useState([])
    const [readMore, setReadMore] = useState(false)
    const [authorReadMore, setAuthorReadMore] = useState(false)
    const [reviewReadMore, setReviewerReadMore] = useState(false)
    const [communityReadMore, setCommunityReadMore] = useState(false)

    const [userErrorMessage, setUserErrorMsg] = useState('')
    const [userSuccessMsg, setUserSuccesMsg] = useState('')

    const [communityComment, setCommunityComment] = useState({
        comment : "",
        commRate : ""
    })


    //Fetch user
    useEffect(() => {
        if(!user) return
        const fetchUserData = async () => {
            try {
                const token = Cookies.get("token")
                const response = await axios.get(`${backEndUrl}/libraryusers`, {
                    headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}
                })

                response.data.valid ? setMember(response.data) : console.error("error fetching user data form database", response.data)

                
            } catch (error) {
                console.error("error fetching user", error)
            }
        }

        fetchUserData()
    }, [])

    //Fetch all Books
    useEffect(() => {
        const fetchAllBooks = async () => {
            try {
                const catalogResponse = await axios.get(`${backEndUrl}/books`)
                const catalogbooks = catalogResponse.data

                const formattedData = catalogbooks.map(elem => {
                    const originalDate = new Date(elem.bookPublishDate)
                    const formattedDate = originalDate.toLocaleDateString("en-US", {
                        year:"numeric",
                        month:"2-digit",
                        day:"2-digit"
                    })
                    elem.bookPublishDate = formattedDate
                    return elem
                })

                const suggestedBooksResponse = await axios.get(`${backEndUrl}/suggestions`)
                const suggestedBooks = suggestedBooksResponse.data

                const suggestedBooksFormattedData = suggestedBooks.map(elem => {
                    const originalDate = new Date(elem.bookPublishDate)
                    const formattedDate = originalDate.toLocaleDateString("en-US", {
                        year:'numeric',
                        month:"2-digit",
                        day:"2-digit"
                    })
                    elem.bookPublishDate = formattedDate
                    return elem
                })

                const combineBooks = [...formattedData, ...suggestedBooksFormattedData]

                setAllBooks(combineBooks)


            } catch (error) {
                console.log("error fetching books", error)
            }
        }
        fetchAllBooks()
    }, [])

    const handleReadMore = () => {
        setReadMore(!readMore)
    }

    const handleAuthorReadMore = () => {
        setAuthorReadMore(!authorReadMore)
    }

    const handleCommunityReadMore = () => {
        setCommunityReadMore(!communityReadMore)
    }

    const handleReviewerReadMore = () => {
        setReviewerReadMore(!reviewReadMore)
    }

    const handleAddToForLater = async (e, _id) => {
        e.preventDefault()

        const requestObject = {
            userid : member.user.id,
            bookid : _id
        }
        

        try {
            const response = await axios.post(`${backEndUrl}/setbookshelf`, requestObject , {
                headers: {"Content-Type": "application/json"}
            })

            if(response.status === 200) {
                setUserSuccesMsg("Book added to your shelf")

                setTimeout(() => {
                    setUserSuccesMsg("")
                }, 2000);
            }


            
        } catch (error) {
            console.log("error updating book on shelves", error)
            if(error.response && error.response.data && error.response.data.message) {
                setUserErrorMsg(error.response.data.message)
                setTimeout(() => {
                    setUserErrorMsg("")
                }, 2000);
            }
        }

    }

    const handleCommunityComment = (e) => {
        const {name, value} = e.target
        setCommunityComment((prev) => ({...prev, [name]: value}))
    }

    const handleCommunitySubmit = async (e, _id) => {
        e.preventDefault();
    
        // Convert commRate to a number
        const commRateNumber = parseInt(communityComment.commRate);
    
        const requestObject = {
            username: member.user.userName,
            bookid: _id,
            comment: communityComment.comment,
            commRate: commRateNumber  
        };
        
        try {
            const response = await axios.post(`${backEndUrl}/usercomment`, requestObject, {
                headers: { "Content-Type": "application/json" }
            });
    
            if (response.status === 200) {

                setCommunityComment({
                    comment: "",
                    commRate: ""
                });
    
            }
    
          

        } catch (error) {
            console.log("Error inserting user comment", error);
        }
    };


    return (
        <div>
            <NavLink to="/Dashboard">
                <div className={bookdetailsstyle.backbutton}>
                    <p> <MoveLeft /> My Dashboard</p>
                </div>
            </NavLink>

            {allBooks && _id && allBooks.map((elem, index) => {
                if(elem._id === _id) {
                    return (
                        <div key={index} className={bookdetailsstyle.mainContainer}>
                            <div className={bookdetailsstyle.bookDiscriptionContainer}>
                                <div>
                                    <img src={`${backEndUrl}/booksimages/${elem.bookImageUrl}`} alt="book image" width="400" height="550" />                                    
                                </div>
                                <div className={bookdetailsstyle.aboutBookWrapper}>
                                    <h1>Title: <span style={{fontWeight:"normal"}}>{elem.bookTitle}</span></h1>
                                    <h3>Author: <span style={{fontWeight:"normal"}}>{elem.bookAuthor}</span></h3>
                                    <div>
                                        <h3 style={{display: "flex"}}>Rating: 
                                            {elem.ratings && elem.ratings > 0 ? (
                                                <span style={{fontWeight: "normal", marginLeft: ".5rem"}}>
                                                    {Array.from({length: Math.max(0, Math.floor(elem.ratings))},
                                                    (_, i) => (
                                                        <Star key={i} fill="black" size={20}/>
                                                    )
                                                        
                                                    )}

                                                    {elem.ratings % 1 !== 0 && (
                                                        <StarHalf fill="black" size={20} />
                                                    )}
                                                </span>
                                            ) : (
                                                ""
                                            )}
                                        
                                        </h3>
                                    </div>
                                    <div>
                                        {<h3>Publish Date: <span style={{fontWeight:"normal"}}>{elem.bookPublishDate}</span></h3>}
                                    </div>
                                    <div >
                                        {readMore ? elem.bookDiscription : elem.bookDiscription.split(' ').slice(0, 100).join(' ')}
                                        <div className={bookdetailsstyle.readMoreButton} >
                                            {readMore ? <span onClick={handleReadMore}>Read Less <ChevronUp/></span> : <span onClick={handleReadMore}>Read More <ChevronDown/></span> }
                                        </div>
                                    </div>
                                </div>
                                <div className={bookdetailsstyle.manageBook}>
                                    <div>
                                        <h2>{elem.bookAvailability === "Yes" ? (<span style={{color:"green"}}>Availible </span>):(<span style={{color:"red"}}>Not Availible</span>)}</h2>
                                        <div style={{display:"flex", justifyContent:"space-around", margin:"1rem"}}>
                                            <p>Copies: {1}</p>
                                            <p>Available: {elem.bookAvailability === "Yes" ? "1" : "0"}</p>
                                        </div>
                                    </div>
                                    <div className={bookdetailsstyle.manageBookWrapper}>
                                        <button className={elem.bookAvailability === "Yes" ? bookdetailsstyle.holdButton : bookdetailsstyle.holdNotAvailable} onClick={(e) => {handleAddToForLater(e, elem._id)}}><p>For later</p><Bookmark /></button>
                                    </div>
                                </div>
                            </div>

                            <div className={bookdetailsstyle.aboutWrapper}>
                                <h2>About</h2>
                                <div className={bookdetailsstyle.authorDisWrapper}>
                                    <div className={bookdetailsstyle.authorImageWrapper}>
                                        <img src={`${backEndUrl}/booksimages/${elem.authorImage}`} alt="author image" width="150" height="150" style={{borderRadius:"50%"}} />
                                        <h2>{elem.bookAuthor}</h2>
                                    </div>
                                    <h3>About Author</h3>
                                    <div >
                                        {authorReadMore ? elem.aboutAuthor : elem.aboutAuthor.split(' ').slice(0, 100).join(' ')}
                                        <div className={bookdetailsstyle.readMoreButton} >
                                            {authorReadMore ? <span onClick={handleAuthorReadMore}>Read Less <ChevronUp/></span> : <span onClick={handleAuthorReadMore}>Read More <ChevronDown/></span> }
                                        </div>
                                    </div>
                                    <div className={bookdetailsstyle.detailsWrapper}>
                                        <h2>Details</h2>
                                        <h4>Publish Date: <span style={{fontSize:"1rem", fontWeight:"normal"}}>{elem.bookPublishDate}</span></h4>
                                        <h4>Genre: <span style={{fontSize:"1rem", fontWeight:"normal"}}>{elem.bookGenre}</span> </h4>
                                        <h4>Book ISBN: <span style={{fontSize:"1rem", fontWeight:"normal"}}>{elem.bookIsbn}</span> </h4>
                                    </div>
                                </div>
                            </div>

                            <div className={bookdetailsstyle.opinionWrapper}>
                                <h2>Opinion</h2>
                                <div>
                                    <div className={bookdetailsstyle.reviewerMainContainer}>
                                        <h4>From Reviewers</h4>
                                        <div className={bookdetailsstyle.reviewersContainer}>
                                            {elem.reviewandrating.map((reviewElem, index) => (
                                                <div key={index} className={bookdetailsstyle.reviewWrapper}>
                                                    <div className={bookdetailsstyle.userImageWrapper}>
                                                        <img src={`${backEndUrl}/libraryusersprofilepics/${reviewElem.profilepic}`} alt="user image" width="30" height="30" style={{borderRadius:"50%"}}/>
                                                        <div>
                                                            {reviewElem.username}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p style={{fontSize:"1.1rem"}}>
                                                            {new Date(reviewElem.date).toLocaleDateString("en-Us",{
                                                                year:"numeric",
                                                                month:"short",
                                                                day:"2-digit"
                                                            })}
                                                        </p> 
                                                    </div>
                                                    <p style={{display:"flex", alignItems:"center", width:"max-content"}}> <strong>Reviewer Rating:</strong>
                                                        <span style={{marginLeft:".5rem"}}>
                                                            {reviewElem.rating && (
                                                                (() => {
                                                                    switch(parseInt(reviewElem.rating)) {
                                                                        case 1:
                                                                            return <Star fill="#ffc600" stroke="none" size={20} />
                                                                        case 2:
                                                                            return (
                                                                                <>
                                                                                    <Star fill="#ffc600" stroke="none" size={20} />
                                                                                    <Star fill="#ffc600" stroke="none" size={20} />
                                                                                </>
                                                                            )
                                                                        case 3:
                                                                            return (
                                                                                <>
                                                                                    <Star fill="#ffc600" stroke="none" size={20} />
                                                                                    <Star fill="#ffc600" stroke="none" size={20} />
                                                                                    <Star fill="#ffc600" stroke="none" size={20} />
                                                                                </>
                                                                            )
                                                                        case 4:
                                                                            return (
                                                                                <>
                                                                                    <Star fill="#ffc600" stroke="none" size={20} />
                                                                                    <Star fill="#ffc600" stroke="none" size={20} />
                                                                                    <Star fill="#ffc600" stroke="none" size={20} />
                                                                                    <Star fill="#ffc600" stroke="none" size={20} />
                                                                                </>
                                                                            )
                                                                        case 5: 
                                                                            return (
                                                                                <>
                                                                                    <Star fill="#ffc600" stroke="none" size={20} />
                                                                                    <Star fill="#ffc600" stroke="none" size={20} />
                                                                                    <Star fill="#ffc600" stroke="none" size={20} />
                                                                                    <Star fill="#ffc600" stroke="none" size={20} />
                                                                                    <Star fill="#ffc600" stroke="none" size={20} />
                                                                                </>
                                                                            )
                                                                        default:
                                                                            return null
                                                                    }
                                                                })()
                                                            )}
                                                        </span>
                                                    </p>

                                                    <div>
                                                        <p><strong>Currently Reading:</strong> <span>{reviewElem.currentlyreading}</span></p>
                                                        <p><strong>Recommend:</strong> {reviewElem.recommend}</p>
                                                        <div>
                                                            {reviewReadMore ? (
                                                                <>
                                                                    {reviewElem.review}
                                                                    <span onClick={handleReviewerReadMore} className={bookdetailsstyle.reviewerReadmore}>Read less <ChevronUp/></span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {reviewElem.review.split(' ').slice(0, 20).join(' ')}... 
                                                                    <span onClick={handleReviewerReadMore} className={bookdetailsstyle.reviewerReadmore}>Read more <ChevronDown/></span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className={bookdetailsstyle.cummunityContainer}>
                                        <h4>From Community</h4>
                                        <form onSubmit={(e) => handleCommunitySubmit(e, elem._id)} encType="multipart/form-data" method="POST">
                                            <label htmlFor="CommuComment">What did you think about this title?</label>
                                            <textarea name="comment" id="CommuComment" cols="30" rows="10" placeholder="Add Comment" value={communityComment.comment} onChange={handleCommunityComment}></textarea>
                                            <div className={bookdetailsstyle.communityratingWrapper}>
                                                <label htmlFor="CommuRating">
                                                    <Star />
                                                    <Star />
                                                    <Star />
                                                    <Star />
                                                    <Star />                                                    
                                                </label>
                                                <select name="commRate" id="CommuRating" value={communityComment.commRate} onChange={handleCommunityComment}>
                                                    <option value="">Rate This</option>
                                                    <option value="1"> 1 star</option>                                                    <option value="2"> 2 stars</option>
                                                    <option value="3"> 3 stars</option>
                                                    <option value="4"> 4 stars</option>
                                                    <option value="5"> 5 stars</option>
                                                </select>

                                                <div className={bookdetailsstyle.communitySubmitButtonWrapper}>
                                                    <button type="submit">Submit</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>

                                    <div>
                                        {elem.comments.map((commentElem, index) => (
                                            <div key={index}>
                                                <div className={bookdetailsstyle.userCommentContainer}>
                                                    <div className={bookdetailsstyle.userNameDateAndRatingContainer}>
                                                        <div className={bookdetailsstyle.userNameContainer}>
                                                            <div className={bookdetailsstyle.userNameAbbriv}>
                                                                <p>{commentElem.username.charAt(0).toUpperCase()}</p>
                                                            </div>
                                                            <p>{commentElem.username}</p>
                                                        </div>
                                                        <div className={bookdetailsstyle.dateAndRatingWrapper}>
                                                            <p>{new Date(commentElem.date).toLocaleDateString("en-US", {
                                                                    year:"numeric",
                                                                    month:"short",
                                                                    day:"2-digit"
                                                                })}
                                                            </p>
                                                            <div>
                                                                {commentElem.userRating && (
                                                                    (() => {
                                                                        switch(commentElem.userRating) {
                                                                            case 1:
                                                                                return <Star fill="#1e96fc" stroke="none" size={20} />
                                                                            case 2:
                                                                                return (
                                                                                    <>
                                                                                        <Star fill="#1e96fc" stroke="none" size={20} />
                                                                                        <Star fill="#1e96fc" stroke="none" size={20} />
                                                                                    </>
                                                                                )
                                                                            case 3:
                                                                                return (
                                                                                    <>
                                                                                        <Star fill="#1e96fc" stroke="none" size={20} />
                                                                                        <Star fill="#1e96fc" stroke="none" size={20} />
                                                                                        <Star fill="#1e96fc" stroke="none" size={20} />
                                                                                    </>
                                                                                )
                                                                            case 4: 
                                                                                return (
                                                                                    <>
                                                                                        <Star fill="#1e96fc" stroke="none" size={20} />
                                                                                        <Star fill="#1e96fc" stroke="none" size={20} />
                                                                                        <Star fill="#1e96fc" stroke="none" size={20} />
                                                                                        <Star fill="#1e96fc" stroke="none" size={20} />
                                                                                    </>
                                                                                )
                                                                            case 5: 
                                                                                return (
                                                                                    <>
                                                                                        <Star fill="#1e96fc" stroke="none" size={20} />
                                                                                        <Star fill="#1e96fc" stroke="none" size={20} />
                                                                                        <Star fill="#1e96fc" stroke="none" size={20} />
                                                                                        <Star fill="#1e96fc" stroke="none" size={20} />
                                                                                        <Star fill="#1e96fc" stroke="none" size={20} />
                                                                                    </>
                                                                                )
                                                                            default:
                                                                                return null
                                                                        }
                                                                    })()
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div>
                                                        {communityReadMore ? (
                                                            <>
                                                                {commentElem.content}
                                                                <span className={bookdetailsstyle.communityReadMoreButton} onClick={handleCommunityReadMore}>Read less <ChevronUp/></span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                {commentElem.content.split(" ").slice(0, 20).join(" ")}...
                                                                <span className={bookdetailsstyle.communityReadMoreButton} onClick={handleCommunityReadMore}>Read more <ChevronDown/></span>
                                                            </>
                                                        )
                                                            
                                                        }
                                                    </div>
                                                    
                                                </div>

                                            </div>
                                        ))}
                                    </div>

                                </div>
                            </div>
                        </div> 
                    )
                }
                return null
            })}

                {userSuccessMsg && (<p className={bookdetailsstyle.successfullyAdded}>{userSuccessMsg}</p>)}
                {userErrorMessage && (<p className={bookdetailsstyle.userErrorMessage}>{userErrorMessage}</p>)}

            
            <div>
                <Fotter />
            </div>
        </div>
    )
}

export default BookDetails
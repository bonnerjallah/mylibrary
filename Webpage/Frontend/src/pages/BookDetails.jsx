import { useState, useEffect } from "react"
import { useAuth } from "../components/AuthContext"
import Cookies from "js-cookie"
import axios from "axios"
import { NavLink, useParams } from "react-router-dom"
import { Bookmark, Carrot, ChevronDown, ChevronUp, MoveLeft } from "lucide-react"
import bookdetailsstyle from "../styles/bookdetailsstyle.module.css"

const BookDetails = () => {

    const {_id} = useParams()
    const {user} = useAuth()

    console.log(_id)



    const [member, setMember] = useState('')
    const [allBooks, setAllBooks] = useState([])
    const [readMore, setReadMore] = useState(false)
    const [authorReadMore, setAuthorReadMore] = useState(false)

    const [userErrorMessage, setUserErrorMsg] = useState('')
    const [userSuccessMsg, setUserSuccesMsg] = useState('')


    //Fetch user
    useEffect(() => {
        if(!user) return
        const fetchUserData = async () => {
            try {
                const token = Cookies.get("token")
                const response = await axios.get("http://localhost:3001/libraryusers", {
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
                const catalogResponse = await axios.get("http://localhost:3001/catalogbooks")
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

                const suggestedBooksResponse = await axios.get("http://localhost:3001/suggestedBooks")
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

    const handleAddToForLater = async (e, _id) => {
        e.preventDefault()

        const requestObject = {
            userid : member.user.id,
            bookid : _id
        }
        

        try {
            const response = await axios.post("http://localhost:3001/setbookshelf", requestObject , {
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




    // console.log(member)
    console.log(allBooks)

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
                                    <img src={`http://localhost:3001/booksimages/${elem.bookImageUrl}`} alt="book image" width="400" height="550" />                                    
                                </div>
                                <div className={bookdetailsstyle.aboutBookWrapper}>
                                    <h1>Title: <span style={{fontWeight:"normal"}}>{elem.bookTitle}</span></h1>
                                    <h3>Author: <span style={{fontWeight:"normal"}}>{elem.bookAuthor}</span></h3>
                                    <div>
                                        <h3>Rating: <span style={{fontWeight:"normal"}}>{elem.rating}</span>****</h3>
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
                                        <img src={`http://localhost:3001/booksimages/${elem.authorImage}`} alt="author image" style={{ borderRadius: "50%", maxWidth: "100%", maxHeight: "100%" }} />
                                        <h3>About Author</h3>
                                    </div>
                                    <div >
                                        {authorReadMore ? elem.bookDiscription : elem.aboutAuthor.split(' ').slice(0, 100).join(' ')}
                                        <div className={bookdetailsstyle.readMoreButton} >
                                            {authorReadMore ? <span onClick={handleAuthorReadMore}>Read Less <ChevronUp/></span> : <span onClick={handleAuthorReadMore}>Read More <ChevronDown/></span> }
                                        </div>
                                    </div>
                                    <div className={bookdetailsstyle.detailsWrapper}>
                                        <h2>Details</h2>
                                        <h4>Publish Date: <span style={{fontSize:"1rem", fontWeight:"normal"}}>{elem.bookPublishDate}</span></h4>
                                        <h4>Genre: <span style={{fontSize:"1rem", fontWeight:"normal"}}>{elem.bookGenre}</span> </h4>
                                    </div>
                                </div>
                            </div>

                            <div className={bookdetailsstyle.opinionWrapper}>
                                <h2>Opinion</h2>
                                <div>
                                    <div>
                                        <h4>From reviewers</h4>
                                        <div>
                                            <p>View All</p>
                                            <div>

                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4>From the Community</h4>
                                        <form>
                                            <label htmlFor="comment">What did you think about this title?</label>
                                            <input type="text" name="" id="comment" placeholder="Add comment" />
                                        </form>
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
        </div>
    )
}

export default BookDetails
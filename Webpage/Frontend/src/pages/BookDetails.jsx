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

    const handleReadMore = () => {
        setReadMore(!readMore)
    }


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
                                    <img src={`http://localhost:3001/booksimages/${elem.bookImageUrl}`} alt="book image" />                                    
                                </div>
                                <div className={bookdetailsstyle.aboutBookWrapper}>
                                    <h1>Title: <span style={{fontWeight:"normal"}}>{elem.bookTitle}</span></h1>
                                    <h3>Author: <span style={{fontWeight:"normal"}}>{elem.bookAuthor}</span></h3>
                                    <div>
                                        <h4>Rating: <span style={{fontWeight:"normal"}}>{elem.rating}</span>****</h4>
                                    </div>
                                    <div>
                                        {<h4>Publish Date: <span style={{fontWeight:"normal"}}>{elem.bookPublishDate}</span></h4>}
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
                                            <p>Copies {1}</p>
                                            <p>Available {1}</p>
                                        </div>
                                    </div>
                                    <div className={bookdetailsstyle.manageBookWrapper}>
                                        <button className={elem.bookAvailability === "Yes" ? bookdetailsstyle.holdButton : bookdetailsstyle.holdNotAvailable}>Place Hold</button>
                                        <div className={bookdetailsstyle.manageButton}>
                                            <p>For later</p><Bookmark />
                                        </div>
                                        <ul>
                                            <li></li>
                                            <li></li>
                                            <li></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3>About</h3>
                                <div>
                                    <h4>About the author</h4>
                                </div>
                            </div>

                            <div>
                                <h3>Opinion</h3>
                                <div>
                                    <h4>From reviewers</h4>
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
                    )
                }
                return null
            })}
        </div>
    )
}

export default BookDetails
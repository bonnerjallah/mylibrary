import { ArrowDown, ArrowLeft, BookOpenText, LibraryBig, Plus} from "lucide-react"
import { NavLink } from "react-router-dom"
import { useAuth } from "../components/AuthContext"
import { useCallback, useEffect, useReducer, useState } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import { ChevronDown } from "lucide-react"



import SearchModal from "../components/SearchModal"
import Footer from "../components/Footer"
import shelfstyle from "../styles/shelfstyle.module.css"
import Completed from "../components/Completed"
import Inprogress from "../components/Inprogress"
import Forlater from "../components/Forlater"

const Shelf = () => {

    const {user} = useAuth()

    const [member, setMember] = useState('')
    const [allBooks, setAllBooks] = useState([])
    const [sortBy, setSortBy] = useState(false)
    const [shelfBookid, setShelfBookid] = useState([])

    const [shelfAuthorFilter, setShelfAuthorFilter] = useState('')
    const [shelfGenreFilter, setShelfGenreFilter] = useState('')


    
    const [showModal, setShowModal] = useState(false)

    const [showCompleted, setShowCompleted] = useState(false)
    const handleShowCompleted = () => {
        setShowCompleted(true);
        setShowInprogress(false); 
        setShowForlater(false);   
    }

    const [showInprogress, setShowInprogress] = useState(false)
    const handleShowInprogress = () => {
        console.log("In progress clicked")
        setShowCompleted(false);  
        setShowInprogress(true);
        setShowForlater(false);   
    }

    const [showForLater, setShowForlater] = useState(false)
    const handleShowForLater = () => {
        console.log("for later clicked")
        setShowCompleted(false);  
        setShowInprogress(false); 
        setShowForlater(true);
    }

    const [isAuthorWrapperVisible, setIsAuthorWrapperVisible] = useState(false)
    const handleAuthorWrapper = () => {
        setIsAuthorWrapperVisible(!isAuthorWrapperVisible)
    }

    const [showGenre, setShowGenreWrapper] = useState(false)
    const handleShowGenreWrapper = () => {
        setShowGenreWrapper(!showGenre)
    }

    //Fetch user data
    axios.defaults.withCredentials = true
    useEffect(() => {

        const fetchUserData = async () => {
            if(!user)return
            try {
                const token = Cookies.get("token")
                const response = await axios.get("http://localhost:3001/libraryusers", {
                    headers: {"Content-Type": "application/json", "Authorization": `Bearer${token}`}
                })
    
                response.data.valid ? setMember(response.data) : console.error("Error fetching user from database", response.data)
    
            } catch (error) {
                console.error("Error fetching user data", error)
            }
        }
                
        fetchUserData()

    }, [])

    const handleshowmodal = () => {
        setShowModal(true)
    }

    //Fetch all Books
    useEffect(() => {
        const fetchBooksData = async () => {
            try {
                const catalogResponse = await axios.get("http://localhost:3001/catalogbooks")
                const bookCatalog = (catalogResponse.data)

                const formattedData = bookCatalog.map((elem) => {
                    const originalDate = new Date(elem.bookPublishDate)
                    const formattedDate = originalDate.toLocaleDateString("en-US", {
                        year: 'numeric',
                        month: "2-digit",
                        day: "2-digit"
                    });

                    elem.publishDate = formattedDate
                    return elem
                })

                const suggestedBooksResponse = await axios.get("http://localhost:3001/suggestedBooks")
                const suggestedBooks = (suggestedBooksResponse.data)

                const formattedSuggestedData = suggestedBooks.map((elem) => {
                    const originalDate = new Date(elem.bookPublishDate)
                    const formattedDate = originalDate.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day:"2-digit"
                    })

                    elem.publishDate = formattedDate
                    return elem
                })

                const combineBooks = [...formattedData, ...formattedSuggestedData]

                setAllBooks(combineBooks)

            } catch (error) {
            }
        }
        fetchBooksData()
    }, [])

    //Book sorting function
    const handleSortBy = (e) => {
        const selectedOption = e.target.value
        setSortBy(selectedOption)
    }

    //Call back function for setting bookids
    const handleShelfBookid = (shelfBookIds) => {
        setShelfBookid(shelfBookIds)
    }

    //Shelf filter function
    const handleFilterAuthor = (e) => {
        const filterBy = e.target.textContent
        const booksToFilter = allBooks.filter(elem => {
            return shelfBookid.includes(elem._id) && elem.bookAuthor === filterBy
        })

        setShelfAuthorFilter(booksToFilter)
    }

    //Genre filter function
    const handleGenreFilter = (e) => {
        const genre = e.target.textContent 
        
        const genreFilterBy = allBooks.filter(elem => {
            return shelfBookid.includes(elem._id) && elem.bookGenre[0].split(' ')[0] === genre
        })

        setShelfGenreFilter(genreFilterBy)
    }

    
    

    return (
        <>
            <div className={shelfstyle.userNameContainer}>
                <div className={shelfstyle.usernameWrapper}>
                    {member && (<p style={{backgroundColor:"#720026", borderRadius:"50%", color:"white", padding:" 0 .5rem", fontSize:"2rem"}}>{member.user.userName.charAt(0).toUpperCase()}</p>)}
                    {member && (<h2>{member.user.userName}</h2>)}
                </div>
            </div>
            <div className={shelfstyle.secondHeaderContainer}>
                <NavLink to="/Dashboard">
                    <ArrowLeft className={shelfstyle.backpageArrow} />
                </NavLink>
                <div className={shelfstyle.shelvesWrapper}>
                    <LibraryBig /> 
                    <h2>My Shelves</h2> 
                    <div className={shelfstyle.completedInProgressForLaterWrapper}>
                        <p onClick={handleShowCompleted}>Completed: ({
                            (() => {
                                let completedCount = 0;
                                if(member?.user?.shelf) {
                                    member.user.shelf.forEach(elem => {
                                        if(typeof elem === "object" && elem.completed) {
                                            completedCount++
                                        }
                                    })
                                }
                                return completedCount
                            })()
                        })</p>

                        <p onClick={handleShowInprogress}>In Progress: ({
                            (() => {
                                let progCount = 0;
                                if (member?.user?.shelf) {
                                    member.user.shelf.forEach(elem => {
                                        if (typeof elem === "object" && elem.inprogress) {
                                            progCount++;
                                        }
                                    });
                                }
                                return progCount;
                            })()
                        })</p>

                        <p onClick={handleShowForLater}>For Later: ({
                            (() => {
                                let forlaterCount = 0
                                if(member?.user?.shelf) {
                                    member.user.shelf.forEach(elem => {
                                        if(typeof elem === "object" && elem.forlater) {
                                            forlaterCount++
                                        }
                                    })
                                }
                                return forlaterCount
                            })()
                        })</p>
                        
                    </div>
                </div>
            </div>

            {member && member.user.shelf.length > 0 ? (
                <div className={shelfstyle.addedBooksShelfMainContainer}>
                <div className={shelfstyle.addBookShelfButtonWrapper}>
                    <button onClick={handleshowmodal}><Plus />Add a title</button>
                </div>
                <div className={shelfstyle.shelfContainer}>
                    <div className={shelfstyle.filterByContainer}>
                        <p style={{marginBottom:"2rem"}}>Filter your result by...</p>
                        <div className={shelfstyle.filterByAuthorAndGenreContainer}>
                            <div className={shelfstyle.byAuthorWrapper}>
                                <p onClick={handleAuthorWrapper}>Author <span><ChevronDown /></span></p>
                                <span className={`${shelfstyle.authorWrapper} ${isAuthorWrapperVisible ? shelfstyle.showAuthorWrapper : ""}`}>{allBooks && shelfBookid &&(
                                    <p style={{display:"flex", flexDirection:"column"}}>{shelfBookid.map(elem => {
                                        const book = allBooks.find(book => book._id === elem) 
                                        return book ? <span key={elem} className={shelfstyle.authorNames} onClick={(e) => handleFilterAuthor(e)}>{book.bookAuthor}</span> : null
                                })}</p>)}</span>
                            </div>
                            <div className={shelfstyle.byGenreWrapper}>
                                <p onClick={handleShowGenreWrapper}>Genre <span><ChevronDown /></span></p>
                                <span className={`${shelfstyle.genereWrapper} ${showGenre ? shelfstyle.showGenreWrapper : ""}`}> {allBooks && shelfBookid && (<small>
                                    {shelfBookid.map(elem => {
                                        const book = allBooks.find(book => book._id === elem)
                                        return book ? <span key={elem}>{book.bookGenre.map((genre, index) => (
                                            <span key={index} className={shelfstyle.bookgenres} onClick={(e) => handleGenreFilter(e)}>{genre.split(' ').slice(0,1).join(' ')}</span>
                                        ))}</span> : null
                                    })}
                                </small>)} </span>
                            </div>
                        </div>
                    </div>
                    
                    <div className={shelfstyle.shelfWrapper}>
                        <div className={shelfstyle.sortWrapper}>
                            Sort by:
                                <select style={{marginLeft:".5rem"}} onChange={(e) => {handleSortBy(e)}}>
                                    <option value="dateAdded">Date Added</option>
                                    <option value="title">Title</option>
                                    <option value="author">Author</option>
                                </select>
                        </div>
                        <div className={shelfstyle.booksOnShelfWrapper}>
                                    
                        {showCompleted ? (
                            <Completed  sortBy={sortBy} filterAuthorBooks={shelfAuthorFilter} filterBooksByGenre={shelfGenreFilter} />
                        ) : showInprogress ? (
                            <Inprogress sortBy={sortBy} filterAuthorBooks={shelfAuthorFilter} filterBooksByGenre={shelfGenreFilter} />
                        ) : (
                            <Forlater sortBy={sortBy} onBookIdChange={handleShelfBookid} filterAuthorBooks={shelfAuthorFilter} filterBooksByGenre={shelfGenreFilter} />
                        )}

                        </div>

                    </div>
                </div>
            </div>
            ):(
                <div className={shelfstyle.mainContainer}>
                <LibraryBig size={48} />
                <h2>Your shelf is empty</h2>
                <p>Add titles to your shelf to keep track of items you want to read, listen to, and watch in the future</p>
                <button onClick={handleshowmodal}><Plus />Add a title</button>
            </div>
            )}


            {showModal && (<SearchModal closeModal={setShowModal} />)}
            <div>
                <Footer />
            </div>
        </>
    )
}

export default Shelf
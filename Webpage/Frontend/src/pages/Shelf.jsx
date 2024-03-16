import { ArrowDown, ArrowLeft, BookOpenText, LibraryBig, Plus} from "lucide-react"
import { NavLink } from "react-router-dom"
import { useAuth } from "../components/AuthContext"
import { useEffect, useState } from "react"
import axios, { Axios } from "axios"
import Cookies from "js-cookie"
import { ChevronDown } from "lucide-react"


import SearchModal from "../components/SearchModal"
import Footer from "../components/Footer"
import shelfstyle from "../styles/shelfstyle.module.css"

const Shelf = () => {

    const user = useAuth()

    const [allBooks, setAllBooks] = useState([])
    const [member, setMember] = useState('')
    const [showModal, setShowModal] = useState(false)


    const [isAuthorWrapperVisible, setIsAuthorWrapperVisible] = useState(false)
    const handleAuthorWrapper = () => {
        setIsAuthorWrapperVisible(!isAuthorWrapperVisible)
    }

    const [showGenre, setShowGenreWrapper] = useState(false)
    const handleShowGenreWrapper = () => {
        setShowGenreWrapper(!showGenre)
    }

    const [showManage, setManage] = useState(false)
    const handleManageShowing = () => {
        setManage(!showManage)
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

                response.data.valid ? setMember(response.data) : console.log("Error fetching user from database", response.data)

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
                console.log("Error fetching book", error)
            }
        }
        fetchBooksData()
    }, [])

    console.log(allBooks)


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
                        <p>Completed (0)</p>
                        <p>In Progress (0)</p>
                        {member && member.user.shelf && (<p>For Later ({member.user.shelf.length})</p>)}
                        
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
                        <p>Filter your result by...</p>
                        <div className={shelfstyle.radioContainer}>
                            <label htmlFor="AllItems">
                                <input type="radio" name="allitems" id="AllItems" />
                                All Items
                            </label>

                            <label htmlFor="PrivateItems">
                                <input type="radio" name="privateitems" id="PrivateItems" />
                                My Private Items
                            </label>

                            <label htmlFor="MySharedItems">
                                <input type="radio" name="shareditems" id="MySharedItems" />
                                My Shared Items
                            </label>
                        </div>
                        <div className={shelfstyle.filterByAuthorAndGenreContainer}>
                            <div className={shelfstyle.byAuthorWrapper}>
                                <p onClick={handleAuthorWrapper}>Author <span><ChevronDown /></span></p>
                                <span className={`${shelfstyle.authorWrapper} ${isAuthorWrapperVisible ? shelfstyle.showAuthorWrapper : ""}`}>AuthorName (1)</span>
                            </div>
                            <div className={shelfstyle.byGenreWrapper}>
                                <p onClick={handleShowGenreWrapper}>Genre <span><ChevronDown /></span></p>
                                <span className={`${shelfstyle.genereWrapper} ${showGenre ? shelfstyle.showGenreWrapper : ""}`}>GenreHere (2)</span>
                            </div>
                            
                        </div>
                    </div>
                    
                    <div className={shelfstyle.shelfWrapper}>
                        <div className={shelfstyle.sortWrapper}>
                            Sort by:
                                <select style={{marginLeft:".5rem"}}>
                                    <option value="dateAdded">Date Added</option>
                                    <option value="title">Title</option>
                                    <option value="author">Author</option>
                                </select>
                        </div>
                        <div className={shelfstyle.booksOnShelfWrapper}>
                            {allBooks && member.user && member.user.shelf.length > 0 && member.user.shelf.map((shelfItem, index) => {
                                const book = allBooks.find(book => book._id === shelfItem.bookid);
                                if (!book) {
                                    console.log(`Book with id ${shelfItem.bookid} not found in allBooks`);
                                    return null; 
                                }

                                return (
                                    <div key={index} className={shelfstyle.shelfBooksWrapper}>
                                        <div style={{ display: "flex", columnGap: ".5rem" }}>
                                            <img src={`http://localhost:3001/booksimages/${book.bookImageUrl}`} alt="book image" width="100" height="150" />
                                            <div style={{display:"flex", flexDirection:"column", rowGap:".5rem"}}>
                                                <div>
                                                    {book.bookTitle}
                                                </div>
                                                <div>
                                                    <span style={{color:"blue"}}>by:</span> {book.bookAuthor}
                                                </div>
                                                <div>
                                                    <p style={{fontSize:'1rem', display:"flex", alignItems:"center", columnGap:".5rem"}}><span style={{fontSize:'1rem', display:"flex", alignItems:"center"}}><BookOpenText size={15}/></span> Publish - <small>{book.publishDate}</small></p>
                                                </div>
                                                <div>
                                                    {book.bookAvailability === "Yes" ? (<p style={{fontSize:"1rem", color:"green"}}>Available</p>) : (<p style={{fontSize:"1rem", color:"red"}}>Not Available</p>)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={shelfstyle.manageButtonWrapper}>
                                            <div className={shelfstyle.manageListWrapperButton} onClick={handleManageShowing}>
                                                Manage Item <ChevronDown/>
                                            </div>
                                            <ul name="" id="" className={`${shelfstyle.manageBook} ${showManage ? shelfstyle.showmanagevisible : ""}`} >
                                                <li>Completed</li>
                                                <li>In Progress</li>
                                                <li>Remove form shelves</li>
                                                <li>I Own this</li>
                                            </ul> 
                                            
                                            <p style={{ backgroundColor: "green" }}>Place hold</p>
                                            <small>Date Added</small>   
                                        </div>
                                    </div>
                                );
                            })}
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
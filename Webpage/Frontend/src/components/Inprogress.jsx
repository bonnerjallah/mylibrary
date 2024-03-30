import { useState, useEffect } from "react"
import { ArrowDown, ArrowLeft, BookOpenText, LibraryBig, Plus, ChevronDown} from "lucide-react"
import { NavLink } from "react-router-dom"
import { useAuth } from "../components/AuthContext"
import axios from "axios"
import Cookies from "js-cookie"

import shelfstyle from "../styles/shelfstyle.module.css"


const Inprogress = ({sortBy, filterAuthorBooks, filterBooksByGenre}) => {
    const {user} = useAuth()

    const [allBooks, setAllBooks] = useState([])
    const [member, setMember] = useState('')
    const [message, setMessage] = useState('')
    const [userShelf, setUserShelf] = useState([])
    


    const [showManage, setShowManage] = useState({});

    //Show Manage list Item Function
    const handleManageShowing = (shelfItemId) => {
        setShowManage(prevState => {
            const newState = {
                ...prevState,
                [shelfItemId]: !prevState[shelfItemId] // Toggle visibility
            };
            return newState;
        });
    };

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

                response.data.valid ? setUserShelf(response.data.user.shelf) : console.log("Error setting user shelf", response.data)

    
            } catch (error) {
                console.error("Error fetching user data", error)
            }
        }
                
        fetchUserData()

    }, [])


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


    const handleDeleteBookFromShelves =  async (bookid) => {
        const _id = member.user.id
        try {
            const response = await axios.delete(`http://localhost:3001/deletefromshelves/${bookid}/${_id}`, {
                headers: {"Content-Type": "application/json"}
            })
            
            if(response.status === 200) {
                console.log("deleted book successfully")

                setUserShelf(prevShelf => {
                    const updatedShelfItems = prevShelf.filter(item => item.bookid !== bookid);
                    return updatedShelfItems;
                });
            }

            setMessage("Deleted book form shelves")

            setTimeout(() => {
                setMessage("")

            }, 2000);

        } catch (error) {
            console.log("error deleting book form shelf", error)
        }
    }

    //Shelf Update Function
    const handleManageBook = async (e, bookid) => {
        const manageAction = e.target.textContent
        const _id = member.user.id

        try {
            const response = await axios.put(`http://localhost:3001/updatebookonshelves/${bookid}/${_id}`, {Action: manageAction})

            if(response.status === 200) {
                console.log("updated book successfully")

                setUserShelf(prevShelf => {
                    const updatedShelfItems = prevShelf.filter(item => item.bookid !== bookid);
                    return updatedShelfItems;
                });

                fetchUserData()

            }
        } catch (error) {
            console.log("error updating book on shelves", error)
        }
    }


    useEffect(() => {
        const handleSort = () => {
            // Map over userShelf to retrieve corresponding book objects from allBooks
            const userShelfWithBooks = userShelf.map(shelfItem => {
                const book = allBooks.find(book => book._id === shelfItem.bookid);
                if (!book) {
                    console.log(`Book with id ${shelfItem.bookid} not found in allBooks`);
                    return null;
                }
                return { ...shelfItem, book }; // Merge shelfItem and book object
            });
    
            // Sort the userShelfWithBooks array based on sortBy
            setUserShelf(prevUserShelf => {
                let sortedUserShelf = [...userShelfWithBooks];
                if (sortBy === "title") {
                    sortedUserShelf.sort((a, b) => {
                        return a.book.bookTitle.localeCompare(b.book.bookTitle);
                    });
                } else if (sortBy === "author") {
                    sortedUserShelf.sort((a, b) => {
                        return a.book.bookAuthor.localeCompare(b.book.bookAuthor);
                    });
                } else if (sortBy === "dateAdded") {
                    sortedUserShelf.sort((a, b) => {
                        return new Date(a.date) - new Date(b.date);
                    });
                }
                return sortedUserShelf;
            });
        };
    
        handleSort();
    }, [sortBy]);


    return (
        <div>
            {filterAuthorBooks ? (
                <div>
                {filterAuthorBooks.map((elem, id) => (
                <div key={id} className={shelfstyle.shelfBooksWrapper}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                        <div style={{ display: "flex", columnGap: ".5rem" }}>
                            <img src={`http://localhost:3001/booksimages/${elem.bookImageUrl}`} alt="book image" width="100" height="150" />
                            <div style={{ display: "flex", flexDirection: "column", rowGap: ".5rem" }}>
                                <div>{elem.bookTitle}</div>
                                <div><span style={{ color: "blue" }}>by:</span> {elem.bookAuthor}</div>
                                <div>
                                    <p style={{ fontSize: '1rem', display: "flex", alignItems: "center", columnGap: ".5rem" }}>
                                        <span style={{ fontSize: '1rem', display: "flex", alignItems: "center" }}>Publish:  <small style={{marginLeft: ".5rem"}}>{elem.publishDate}</small></span>
                                    </p>
                                </div>
                                <div>
                                    {elem.bookAvailability === "Yes" ? (<p style={{ fontSize: "1rem", color: "green" }}>Available</p>) : (<p style={{ fontSize: "1rem", color: "red" }}>Not Available</p>)}
                                </div>
                            </div>
                        </div>
                        <div className={shelfstyle.manageButtonWrapper}>
                            <div className={shelfstyle.manageListWrapperButton} onClick={() => handleManageShowing(elem._id)}>
                                Manage Item <ChevronDown/>
                            </div>
                            <ul name="" id="" className={`${shelfstyle.manageBook} ${showManage[elem._id] ? shelfstyle.showmanagevisible : ""}`}>
                                <li onClick={(e) => handleManageBook(e, elem.bookid)}>Completed</li>
                                <li onClick={(e) => handleManageBook(e, elem.bookid)}>In Progress</li>
                                <li onClick={(e) => handleManageBook(e, elem.bookid)}>I own this</li>
                            </ul>
                            <p className={shelfstyle.placeHoldButton} onClick={(e) => handleManageBook(e, elem.bookid)}>Place hold</p>
                            <span> <strong style={{ color: "goldenrod" }}>Added:</strong> {new Date(elem.date).toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" }).replace(/\//g, '-')}</span>
                        </div>
                    </div>
                    <div className={shelfstyle.deleteButtonWrapper}>
                        <button onClick={() => handleDeleteBookFromShelves(elem.bookid)} className={shelfstyle.deleteButton}>Delete</button>
                    </div>
                    {message && (<p className={shelfstyle.deletingBookMessage}>{message}</p>)}
                </div>
                ))}
            </div>
            ) : filterBooksByGenre ? (
                <div>
                    {filterBooksByGenre.map((elem, id) => (
                    <div key={id} className={shelfstyle.shelfBooksWrapper}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                            <div style={{ display: "flex", columnGap: ".5rem" }}>
                                <img src={`http://localhost:3001/booksimages/${elem.bookImageUrl}`} alt="book image" width="100" height="150" />
                                <div style={{ display: "flex", flexDirection: "column", rowGap: ".5rem" }}>
                                    <div>{elem.bookTitle}</div>
                                    <div><span style={{ color: "blue" }}>by:</span> {elem.bookAuthor}</div>
                                    <div>
                                        <p style={{ fontSize: '1rem', display: "flex", alignItems: "center", columnGap: ".5rem" }}>
                                            <span style={{ fontSize: '1rem', display: "flex", alignItems: "center" }}>Publish:  <small style={{marginLeft: ".5rem"}}>{elem.publishDate}</small></span>
                                        </p>
                                    </div>
                                    <div>
                                        {elem.bookAvailability === "Yes" ? (<p style={{ fontSize: "1rem", color: "green" }}>Available</p>) : (<p style={{ fontSize: "1rem", color: "red" }}>Not Available</p>)}
                                    </div>
                                </div>
                            </div>
                            <div className={shelfstyle.manageButtonWrapper}>
                                <div className={shelfstyle.manageListWrapperButton} onClick={() => handleManageShowing(elem._id)}>
                                    Manage Item <ChevronDown/>
                                </div>
                                <ul name="" id="" className={`${shelfstyle.manageBook} ${showManage[elem._id] ? shelfstyle.showmanagevisible : ""}`}>
                                    <li onClick={(e) => handleManageBook(e, elem.bookid)}>Completed</li>
                                    <li onClick={(e) => handleManageBook(e, elem.bookid)}>In Progress</li>
                                    <li onClick={(e) => handleManageBook(e, elem.bookid)}>I own this</li>
                                </ul>
                                <p className={shelfstyle.placeHoldButton} onClick={(e) => handleManageBook(e, elem.bookid)}>Place hold</p>
                                <span> <strong style={{ color: "goldenrod" }}>Added:</strong> {new Date(elem.date).toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" }).replace(/\//g, '-')}</span>
                            </div>
                        </div>
                        <div className={shelfstyle.deleteButtonWrapper}>
                            <button onClick={() => handleDeleteBookFromShelves(elem.bookid)} className={shelfstyle.deleteButton}>Delete</button>
                        </div>
                        {message && (<p className={shelfstyle.deletingBookMessage}>{message}</p>)}
                    </div>
                    ))}
                </div>
            ) : (
                allBooks && userShelf.length > 0 && userShelf.map((shelfItem, index) => {
                                
                    if(typeof shelfItem === "object" && shelfItem.inprogress) {
                        const book = allBooks.find(book => book._id === shelfItem.bookid);
                        if (!book) {
                            console.log(`Book with id ${shelfItem.bookid} not found in allBooks`);
                            return null;
                        }
                        return (
                            <div key={index} className={shelfstyle.shelfBooksWrapper}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                                    <div style={{ display: "flex", columnGap: ".5rem" }}>
                                        <img src={`http://localhost:3001/booksimages/${book.bookImageUrl}`} alt="book image" width="100" height="150" />
                                        <div style={{ display: "flex", flexDirection: "column", rowGap: ".5rem" }}>
                                            <div>{shelfItem.bookTitle}</div>
                                            <div><span style={{ color: "blue" }}>by:</span> {book.bookAuthor}</div>
                                            <div>
                                                <p style={{ fontSize: '1rem', display: "flex", alignItems: "center", columnGap: ".5rem" }}>
                                                    <span style={{ fontSize: '1rem', display: "flex", alignItems: "center" }}>Publish: <small style={{marginLeft: ".5rem"}}>{book.publishDate}</small></span>
                                                </p>
                                            </div>
                                            <div>
                                                {book.bookAvailability === "Yes" ? (<p style={{ fontSize: "1rem", color: "green" }}>Available</p>) : (<p style={{ fontSize: "1rem", color: "red" }}>Not Available</p>)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={shelfstyle.manageButtonWrapper}>
                                        <div className={shelfstyle.manageListWrapperButton} onClick={() => handleManageShowing(shelfItem._id)}>
                                            Manage Item <ChevronDown/>
                                        </div>
                                        <ul name="" id="" className={`${shelfstyle.manageBook} ${showManage[shelfItem._id] ? shelfstyle.showmanagevisible : ""}`}>
                                            <li onClick={(e) => handleManageBook(e, shelfItem.bookid)}>Completed</li>
                                            <li onClick={(e) => handleManageBook(e, shelfItem.bookid)}>In Progress</li>
                                            <li onClick={(e) => handleManageBook(e, shelfItem.bookid)}>I own this</li>
                                        </ul>
                                        <p className={shelfstyle.placeHoldButton} onClick={(e) => handleManageBook(e, shelfItem.bookid)}>Place hold</p>
                                        <span> <strong style={{ color: "goldenrod" }}>Added:</strong> {new Date(shelfItem.date).toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" }).replace(/\//g, '-')}</span>
                                    </div>
                                </div>
                                <div className={shelfstyle.deleteButtonWrapper}>
                                    <button onClick={() => handleDeleteBookFromShelves(shelfItem.bookid)} className={shelfstyle.deleteButton}>Delete</button>
                                </div>
                                {message && (<p className={shelfstyle.deletingBookMessage}>{message}</p>)}
                            </div>
                        );
                    }
    
                })
            )}

            
        </div>
    )
}

export default Inprogress
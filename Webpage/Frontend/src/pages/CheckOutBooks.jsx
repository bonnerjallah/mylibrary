import { useState, useEffect, useRef } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import { useAuth } from "../components/AuthContext"
import { NavLink, useParams,useNavigate } from "react-router-dom"

import BookCheckedOutModal from "../components/BookCheckedOutModal"

import checkoutbookstyle from "../styles/checkoutbookstyle.module.css"


const backEndUrl = import.meta.env.VITE_BACKEND_URL


const CheckOutBooks = () => {

    const {user} = useAuth()
    const {_id} = useParams()
    const navigate = useNavigate()

    const [member, setMember] = useState('')
    const [allBooks, setAllBooks] = useState([])
    const [showBookCheckOutModal, setShowBookCheckedOutModal] = useState(false)
    const [BookBeingCheckedOut, setBookBeingCheckedOut] = useState({
        bookOnHold : ""
    })
    const [checkOutObject, setCheckOutObject] = useState({
        currentTitle: '',
        checkOutDate: '',
        returnDate: ''
    })
    const [selectedBook, setSelectedBook] = useState({})
    const [bookOnHoldForCheckOut, setBookOnHoldForCheckOut] = useState({})
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [expectedReturnDate, setExpectedReturnDate] = useState(null)
    const [latefee, setLateFee] = useState(0)
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const outDateRef = useRef(null)
    const returnDateRef = useRef(null)
    



    axios.defaults.withCredentials = true
    useEffect(() => {
        if(!user) return
        const fetchUserData = async () => {
            try {
                const token = Cookies.get("token")
                const response = await axios.get(`${backEndUrl}/libraryusers`, {
                    headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}
                })

                response.data.valid ? setMember(response.data) : console.log("error fetching user form database", response.data)
                
            } catch (error) {
                console.error("error fetching user", error)
            }
        }
        fetchUserData()
    }, [])


    useEffect(() => {
        const fetchAllBooks = async () => {
            try {
                const response = await axios.get(`${backEndUrl}/books`)
                const catalogbooks = response.data

                const suggestedBooksResponse = await axios.get(`${backEndUrl}/suggestions`)
                const suggestedBooks = suggestedBooksResponse.data

                const combineBooks = [...catalogbooks, ...suggestedBooks]

                setAllBooks(combineBooks)
                
            } catch (error) {
                console.log("error fetching all books", error)
            }
        }
        fetchAllBooks()
    }, [])


    //book on hold for checkout function
    useEffect(() => {
        const holdBookForCheckOut = () => {
            const holdForCheckOut = allBooks.find(elem => elem._id === _id)
            setBookOnHoldForCheckOut(holdForCheckOut)
            setLateFee("50");

        }
        holdBookForCheckOut()
    }, [_id, allBooks])
    

    const handleShowBookCheckOutModal = () => {
        setShowBookCheckedOutModal(true)
    }


    //Selected book function
    const handleBookBeingCheckedOut = (e) => {
        const checkOutBook = e.target.value;
    
        // Update book being checked out
        setBookBeingCheckedOut((prev) => ({ ...prev, bookOnHold: checkOutBook }));
    
        // Find selected book
        const selectedBookToCheckOut = allBooks.find(elem => elem._id === checkOutBook);
        setSelectedBook(selectedBookToCheckOut);
    
        // Set bookOnHoldForCheckOut to null when selectedBook exists
        if (selectedBookToCheckOut) {
            setBookOnHoldForCheckOut('');
        }
    
        // Set checkOutDate to current date
        const checkOutDate = new Date();
        setCheckOutDate(checkOutDate);
    
        // Calculate expectedReturnDate based on checkOutDate (e.g., 30 days from checkOutDate)
        const expectedReturnDate = new Date(checkOutDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        setExpectedReturnDate(expectedReturnDate);
    
        // Calculate days late and late fees
        setLateFee("50");
    };
    
    console.log(bookOnHoldForCheckOut)

    useEffect(() => {
        const currentTitle = bookOnHoldForCheckOut ? bookOnHoldForCheckOut._id : selectedBook._id
        const formatcheckout = outDateRef ? outDateRef.current.innerText : ""
        const formatreturDate = returnDateRef ? returnDateRef.current.innerText : ""


        const checkOutDate = formatcheckout.replace(/[A-Za-z,:]/g, "").trim()
        const returnDate = formatreturDate.replace(/[A-Za-z,:]/g, "").trim()

        if (currentTitle !== checkOutObject.currentTitle || checkOutDate !== checkOutObject.checkOutDate || returnDate !== checkOutObject.returnDate) {
            setCheckOutObject({
                currentTitle,
                checkOutDate,
                returnDate
            });
        }

    }, [bookOnHoldForCheckOut, selectedBook, checkOutObject])


    const handleBookCheckOutSubmit = async (e) => {
        e.preventDefault()

        const requestData = {
            userId : member.user.id,
            bookId: checkOutObject.currentTitle,
            checkOutDate: checkOutObject.checkOutDate,
            expectedreturnDate: checkOutObject.returnDate
        }

        try {
            const response = await axios.post(`${backEndUrl}/checkoutBook`, requestData, {
                headers:{"Content-Type": "application/json"}
            })

            if(response.status === 200) {
                setSuccessMessage("successfully checkout book")

                setTimeout(() => {
                    setSuccessMessage("")
                    setBookOnHoldForCheckOut(false)
                    setSelectedBook(false)
                    navigate("/Dashboard");
                }, 2000);

            }
            
            
        } catch (error) {
            console.log("error inserting checkout data", error)
            if(error && error.response.data && error.response.data && error.response.data.message === "You already checked out this book") {
                setErrorMessage(error.response.data.message)
                setTimeout(() => {
                    setErrorMessage("")
                }, 2500);
            } else if(error && error.response.data && error.response.data && error.response.data.message === "Book not available") {
                setErrorMessage(error.response.data.message)
                setTimeout(() => {
                    setErrorMessage("")
                }, 2500);
            }
        }

    }

    

    return (
        <div className={checkoutbookstyle.mainContainer}>
            <div className={checkoutbookstyle.headerWrapper}>
                <h1>Check Out Book</h1>
            </div>
            <div className={checkoutbookstyle.booksOutWrapper}>
                <h5 onClick={handleShowBookCheckOutModal}>Books Out</h5>
            </div>
            <form onSubmit={handleBookCheckOutSubmit} encType="multipart/form-data" method="POST">
                
                <div className={checkoutbookstyle.firstSection}>
                    <label htmlFor="BooksOnHold">
                            <select name="bookOnHold" id="BooksOnHold" onChange={ handleBookBeingCheckedOut }>
                                <option value="">Select a book</option>
                                {allBooks && member && member.user && member.user.shelf && (
                                    <>
                                        {allBooks.filter((book) => 
                                            member.user.shelf.some((shelfItem) => 
                                                shelfItem.placeholder !== "" && shelfItem.placeholder === book._id
                                            )
                                        ).map((filteredBook, id) => (
                                            <option key={id} value={filteredBook._id} >{filteredBook.bookTitle}</option>
                                        ))}
                                    </>
                                )}
                            </select>
                    </label>
                    
                    <div  className={checkoutbookstyle.isbnAuthorGereWrapper}>
                        <div>
                            <p>Title: <span>{bookOnHoldForCheckOut ? bookOnHoldForCheckOut.bookTitle : selectedBook.bookTitle}</span></p>
                            <p>ISBN: <span>{bookOnHoldForCheckOut ? bookOnHoldForCheckOut.bookIsbn : selectedBook.bookIsbn}</span></p>
                            <p>Author: <span>{bookOnHoldForCheckOut ? bookOnHoldForCheckOut.bookAuthor : selectedBook.bookAuthor}</span></p>
                            <p>Genre: 
                                <span>
                                    {bookOnHoldForCheckOut?.bookGenre?.[0]?.split(' ').slice(0, 1).join(' ') ||
                                    (selectedBook?.bookGenre?.[0]?.split(' ').slice(0, 1).join(' ') || '')}
                                </span>
                            </p>
                        </div>
                    </div>      
                </div>
                <div className={checkoutbookstyle.publishCheckOutDateWrapper}>
                    <p>Publis Date: 
                        <span>{bookOnHoldForCheckOut && bookOnHoldForCheckOut.bookPublishDate ? new Date(bookOnHoldForCheckOut.bookPublishDate).toLocaleDateString("en-US", {
                            year:"numeric",
                            month:"2-digit",
                            day:"2-digit"
                        }) : selectedBook && selectedBook.bookPublishDate ? new Date(selectedBook.bookPublishDate).toLocaleDateString("en-US", {
                            year:"numeric",
                            month:"2-digit",
                            day:"2-digit"
                        }) : ""}
                        </span>
                    </p>
                    <p ref={outDateRef}>Date Check Out: 
                        <span> {bookOnHoldForCheckOut || checkOutDate ? new Date(Date.now()).toLocaleDateString("en-US", {
                            year:"numeric",
                            month:'2-digit',
                            day:'2-digit'
                        }) : ""}
                        </span>
                    </p>
                    <p ref={returnDateRef}>Expected Return Date: 
                        <span>
                            {bookOnHoldForCheckOut || expectedReturnDate ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-Us", {
                                year:'numeric',
                                month:'2-digit',
                                day:'2-digit'
                            }) : ""}
                        </span>
                    </p>
                    <p>Late Fee Or Damage Item: <span>{bookOnHoldForCheckOut ? `$ ${latefee}` : selectedBook ? `$ ${latefee}` : ""}</span></p>
                </div>
                <div>{bookOnHoldForCheckOut ? (
                        <img src={`${backEndUrl}/booksimages/${bookOnHoldForCheckOut.bookImageUrl}`} alt="" width="100" height="120" />
                    ) : selectedBook ? (
                        <img src={`${backEndUrl}/booksimages/${selectedBook.bookImageUrl}`} alt="" width="100" height="120" />
                    ) : (
                        <img src="" alt="" width="100" height="120" />
                    )}
                </div>

                <div className={checkoutbookstyle.checkButtons}>
                    <button type="submit">Check Out</button>
                    <NavLink to="/Dashboard">
                        <button>Cancle</button>
                    </NavLink>
                        
                </div>
                
                
            </form>

            {showBookCheckOutModal && (<BookCheckedOutModal closeModal={setShowBookCheckedOutModal} />)}
            {successMessage && (<p className={checkoutbookstyle.successMsg}>{successMessage}</p>)}
            {errorMessage && (<p className={checkoutbookstyle.errorMessage}>{errorMessage}</p>)}
            
        </div>
    )
}

export default CheckOutBooks
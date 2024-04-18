import { useState, useEffect } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import { useAuth } from "../components/AuthContext"



import checkoutbookstyle from "../styles/checkoutbookstyle.module.css"




const CheckOutBooks = () => {

    const {user} = useAuth()

    const [member, setMember] = useState('')
    const [allBooks, setAllBooks] = useState([])
    const [bookBeingCheckedOut, setBookBeingCheckedOut] = useState({
        bookOnHold : ""
    })
    const [selectedBook, setSelectedBook] = useState({})
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [expectedReturnDate, setExpectedReturnDate] = useState(null)
    const [latefee, setLateFee] = useState(0)


    axios.defaults.withCredentials = true
    useEffect(() => {
        if(!user) return
        const fetchUserData = async () => {
            try {
                const token = Cookies.get("token")
                const response = await axios.get("http://localhost:3001/libraryusers", {
                    headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}
                })

                response.data.valid ? setMember(response.data) : console.log("error fetching user form database", response.data)
                
            } catch (error) {
                console.error("error fetching user", error)
            }
        }
        fetchUserData()
    }, [])

    console.log(member)

    useEffect(() => {
        const fetchAllBooks = async () => {
            try {
                const response = await axios.get("http://localhost:3001/catalogbooks")
                const catalogbooks = response.data

                const suggestedBooksResponse = await axios.get("http://localhost:3001/suggestedBooks")
                const suggestedBooks = suggestedBooksResponse.data

                const combineBooks = [...catalogbooks, ...suggestedBooks]

                setAllBooks(combineBooks)
                
            } catch (error) {
                console.log("error fetching all books", error)
            }
        }
        fetchAllBooks()
    }, [])

    const handleBookBeingCheckedOut = (e) => {
        const checkOutBook = e.target.value;
    
        // Update book being checked out
        setBookBeingCheckedOut((prev) => ({ ...prev, bookOnHold: checkOutBook }));
    
        // Find selected book
        const selectedBookToCheckOut = allBooks.find(elem => elem._id === checkOutBook);
        setSelectedBook(selectedBookToCheckOut);
    
        // Set checkOutDate to current date
        const checkOutDate = new Date();
        setCheckOutDate(checkOutDate);
    
        // Calculate expectedReturnDate based on checkOutDate (e.g., 30 days from checkOutDate)
        const expectedReturnDate = new Date(checkOutDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        setExpectedReturnDate(expectedReturnDate);
    
        // Calculate days late and late fees
        setLateFee("50");
    };
    

    // console.log(bookBeingCheckedOut)
    // console.log("selected book", selectedBook)

    console.log(latefee)


    return (
        <div className={checkoutbookstyle.mainContainer}>
            <div className={checkoutbookstyle.headerWrapper}>
                <h1>Check Out</h1>
            </div>
            <form>
                
                <div className={checkoutbookstyle.firstSection}>
                    <label htmlFor="BooksOnHold">
                        Title: 
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
                    
                    <div className={checkoutbookstyle.isbnAuthorGereWrapper}>
                        <div>
                            <p>ISBN: <span>{selectedBook.bookIsbn}</span></p>
                            <p>Author: <span>{selectedBook.bookAuthor}</span></p>
                            <p>Genre: <span>{selectedBook.bookGenre ? selectedBook.bookGenre[0].split(' ').slice(0,1).join(' ') : ""}</span></p>
                        </div>
                    </div>      

                    
                </div>
                <div className={checkoutbookstyle.publishCheckOutDateWrapper}>
                    <p>Publis Date: 
                        <span>{ selectedBook && selectedBook.bookPublishDate ? new Date(selectedBook.bookPublishDate).toLocaleDateString("en-US", {
                            year:"numeric",
                            month:"2-digit",
                            day:"2-digit"
                        }) : ""}
                        </span>
                    </p>
                    <p>Date Check Out: 
                        <span>{ checkOutDate ? new Date(Date.now()).toLocaleDateString("en-US", {
                            year:"numeric",
                            month:'2-digit',
                            day:'2-digit'
                        }) : ""}
                        </span>
                    </p>
                    <p>Expected Return Date: 
                        <span>
                            { expectedReturnDate ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-Us", {
                                year:'numeric',
                                month:'2-digit',
                                day:'2-digit'
                            }) : ""}
                        </span>
                    </p>
                    <p>Late Fee / Damage: <span>{selectedBook ? `$ ${latefee}` : ""}</span></p>
                </div>
                <div>
                <img src={`http://localhost:3001/booksimages/${selectedBook ? selectedBook.bookImageUrl : ''}`} alt="Book Image" width="100" height="120" />
                </div>

                <div className={checkoutbookstyle.checkButtons}>
                    <button>Check Out</button>
                    <button>Cancle</button>
                </div>
                
                
            </form>
            
        </div>
    )
}

export default CheckOutBooks
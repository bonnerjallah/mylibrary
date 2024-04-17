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
        const checkOutBook = e.target.value

        setBookBeingCheckedOut((prev) => ({...prev , bookOnHold : checkOutBook}))

    }

    console.log(bookBeingCheckedOut)

    return (
        <div className={checkoutbookstyle.mainContainer}>
            <div className={checkoutbookstyle.headerWrapper}>
                <h1>Check Out</h1>
            </div>
            <form>
                
                <div className={CheckOutBooks.firstSection}>
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
                                    <p>ISBN: <span>{allBooks.find(book => book._id === bookBeingCheckedOut.bookOnHold).bookIsbn}</span></p>
                                    <p>Author: <span>{allBooks.find(book => book._id === bookBeingCheckedOut.bookOnHold).bookAuthor}</span></p>
                                    <p>Genre: <span>{allBooks.find(book => book._id === bookBeingCheckedOut.bookOnHold).bookGenre}</span></p>
                                </div>
                        </div>      

                    
                </div>
                <div>
                    <p>Publis Date: <span></span></p>
                    <p>Date Check Out: <span></span></p>
                    <p>Expected Return Date: <span></span></p>
                    <p>Late Fee: <span></span></p>
                </div>
                <div>
                    book image
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
import { useState, useEffect, memo } from "react"
import { useAuth } from "./AuthContext"
import axios from "axios"
import Cookies from "js-cookie"

import bookcheckoutmodalstyle from "../styles/bookcheckoutmodalstyle.module.css"

const backEndUrl = import.meta.env.VITE_BACKEND_URL


const BookCheckedOutModal = ({closeModal}) => {

    const {user} = useAuth()

    const [member, setMember] = useState("")
    const [allBooks, setAllBooks] = useState([])

    //Fetch user
    axios.defaults.withCredentials = true
    useEffect(() => {
        if(!user) return
        const fetchUserData = async () => {
            try {
                const token = Cookies.get("token")
                const response = await axios.get(`${backEndUrl}/libraryusers`, {
                    headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}
                })

                response.data.valid ? setMember(response.data) : console.error("error fetch user form database", response.data)
                
            } catch (error) {
                console.error("error fetching user data", error)
            }
        }
        fetchUserData()
    }, [])


    //fetch allbooks
    useEffect(() => {
        const fetchAllBooks = async () => {
            try {
                const catalogbooksresponse = await axios.get(`${backEndUrl}/books`)
                const catalogbooks = catalogbooksresponse.data

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



    return (
        <div className={bookcheckoutmodalstyle.mainContainer}>
            <div className={bookcheckoutmodalstyle.closeWrapper}>
                <p onClick={() => {closeModal(false)}}>X</p>
            </div>
            <div className={bookcheckoutmodalstyle.headerWrapper}>   
                <h1>Books Out</h1>
            </div>
            <div>
                {allBooks && member && member.user && member.user.checkout && (
                    <div className={bookcheckoutmodalstyle.booksContainer}>
                        {allBooks.filter((book) => member.user.checkout.some(elem => elem.bookid === book._id)).map((filteredBook, id) => (
                            <div key={id} className={bookcheckoutmodalstyle.bookWrapper}>
                                <img src={`${backEndUrl}/booksimages/${filteredBook.bookImageUrl}`} alt="book image" width="100" height="150" />
                                <div>
                                {member.user.checkout.filter(elem => elem.bookid === filteredBook._id).map((elem, index) => (
                                    <div key={index} className={bookcheckoutmodalstyle.dateWrapper}>
                                        <p>
                                            Check Out Date:
                                            <span>
                                                {elem.checkoutdate}
                                            </span>
                                        </p>
                                        <p>
                                            Expected Return Date: 
                                            <span>
                                                {elem.expectedreturndate}
                                            </span>
                                        </p>
                                    </div>
                                ))}
                                </div>
                            </div>
                        ))}
                    </div>
                        
                )}
            </div>

        </div>
    )
}

export default BookCheckedOutModal
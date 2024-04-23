import { useState, useEffect } from "react"
import { useAuth } from "./AuthContext"
import axios from "axios"
import Cookies from "js-cookie"

import bookcheckoutmodalstyle from "../styles/bookcheckoutmodalstyle.module.css"

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
                const response = await axios.get("http://localhost:3001/libraryusers", {
                    headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}
                })

                response.data.valid ? setMember(response.data) : console.error("error fetch user form database", response.data)
                
            } catch (error) {
                console.error("error fetching user data", error)
            }
        }
        fetchUserData()
    }, [])

    console.dir(member)

    //fetch allbooks
    useEffect(() => {
        const fetchAllBooks = async () => {
            try {
                const catalogbooksresponse = await axios.get("http://localhost:3001/catalogbooks")
                const catalogbooks = catalogbooksresponse.data

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



    return (
        <div className={bookcheckoutmodalstyle.mainContainer}>
            <div className={bookcheckoutmodalstyle.closeWrapper}>
                <p onClick={() => {closeModal(false)}}>X</p>
            </div>
            <div className={bookcheckoutmodalstyle.headerWrapper}>   
                <h1>Books Out</h1>
            </div>
            <div className={bookcheckoutmodalstyle.booksContainer}>

                {allBooks && member && member.user && member.user.checkout && (
                    <>
                        {allBooks.filter((book) => member.user.checkout.some(elem => elem.bookid === book._id)).map((filteredBook, index) => (
                            <div key={index}>
                                <img src={`http://localhost:3001/booksimages/${filteredBook.bookImageUrl}`} alt="book image" width="100" height="150" />
                            </div>
                        ))}
                    </>
                )}

                <>
                    {member && member.user && member.user.checkout &&  (
                        <>
                            {member.user.checkout.map((elem, index) => (
                                <div key={index} className={bookcheckoutmodalstyle.dateWrapper}>
                                    <p>
                                        Checked Out Date:
                                        <span>{elem.checkoutdate}</span>
                                    </p>
                                    <p>
                                        Expected Return Date:
                                        <span>{elem.expectedreturndate}</span>
                                    </p>
                                        
                                </div>
                                
                            ))}
                        </>
                    )}
                </>

            </div>
        </div>
    )
}

export default BookCheckedOutModal
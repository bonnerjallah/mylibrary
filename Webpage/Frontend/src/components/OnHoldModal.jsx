import { useState, useEffect } from "react"
import onholdmodalstyle from "../styles/onholdmodalstyle.module.css"
import { useAuth } from "./AuthContext"
import axios from "axios"
import Cookies from "js-cookie"
import { NavLink } from "react-router-dom"

const backEndUrl = import.meta.env.VITE_BACKEND_URL


const OnHoldModal = ({closeModal}) => {
    const {user} = useAuth()

    const [member, setMember] = useState('')
    const [userShelf, setUserShelf] = useState([])
    const [booksOnHold, setBooksOnHold] = useState([])
    const [allBooks, setAllBooks] = useState([])


    //Fetching user data
    axios.defaults.withCredentials = true
    useEffect(() => {
        const fetchUserData = async () => {
            if(!user) return
            try {
                const token = Cookies.get("token")
                const response = await axios.get(`${backEndUrl}/libraryusers`, {
                    headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}
                })

                response.data.valid ? setMember(response.data) : console.error("error fetching user for data base", response.data)

                response.data.valid ? setUserShelf(response.data.user.shelf) : console.error("error setting user shelf", response.data)

            } catch (error) {
                console.error("error fetching user", error)
            }
        }

        fetchUserData()
    }, [])

    //set user book on hold
    useEffect(() => {

        let books = []
        for(let i = 0; i < userShelf.length; i++) {
            if(userShelf[i] && userShelf[i].placeholder !== "") {
                books.push(userShelf[i].bookid)
            }
        }

        setBooksOnHold(books)

    }, [userShelf])

    //fetch allbooks 
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const catalogResponse = await axios.get(`${backEndUrl}/books`)
                const catalog = catalogResponse.data


                const formattedData = catalog.map(elem => {
                    const originaldate = new Date(elem.bookPublishDate)
                    const formattedDate = originaldate.toLocaleDateString("en-US", {
                        year: "numeric",
                        month:"2-digit",
                        day: "2-digit"
                    })

                    elem.bookPublishDate = formattedDate
                    return elem
                })
                
                const suggestedBooksResponse = await axios.get(`${backEndUrl}/suggestions`)
                const suggestions = suggestedBooksResponse.data

                const suggestedBooksFormattedData = suggestions.map(elem => {
                    const originaldate = new Date(elem.bookPublishDate)
                    const formattedDate = originaldate.toLocaleDateString("en-US", {
                        year:"numeric",
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
        fetchBooks()
    }, [])


    const handleDeletingOnHoldBook = async (elem) => {

        const _id = member.user.id

        try {
            const response = await axios.delete(`${backEndUrl}/onholddelete/${elem}/${_id}`, {
                headers:{"Content-Type": "application/json"}
            })

            if(response.status === 200) {
                console.log("successfully remove book from hold")

                setUserShelf(prevshelf => {
                    const updatedShelfItems = prevshelf.filter(item => item.placeholder !== elem)
                    return updatedShelfItems
                })
            }


        } catch (error) {
            console.log("error deleting book", error)
        }
    }



    return (
        <div className={onholdmodalstyle.mainContainer}>
            <div className={onholdmodalstyle.closeButtonWrapper}>
                <p onClick={(e) => {closeModal(false)}} className={onholdmodalstyle.closeButton}>x</p>
            </div>
            <div className={onholdmodalstyle.titleWrapper}>
                <h1>On Hold</h1>
            </div>
            {booksOnHold ? (
                <div className={onholdmodalstyle.bookContainer}>
                {allBooks && booksOnHold && booksOnHold.map((elem, id) => {
                    const bookOnHold = allBooks.find(book => book._id === elem) 

                    return (
                            <div key={id}>
                                {bookOnHold && (
                                    <>
                                        <div className={onholdmodalstyle.bookWrapper}>
                                            <NavLink to={`/BookDetails/${bookOnHold._id}`} >
                                                <div>
                                                    <img src={`${backEndUrl}/booksimages/${bookOnHold.bookImageUrl}`} alt="book image" width="100" height="150" />
                                                </div>
                                            </NavLink>
                                            
                                            <div>
                                                <p style={{fontSize:"1.5rem", color:"#f3ffbd"}}>Title: <span style={{fontSize:"1rem", color:"black"}}>{bookOnHold.bookTitle}</span></p>
                                                <p style={{fontSize:"1.5rem", color:"#f3ffbd"}}>Author: <span style={{fontSize:"1rem", color:"black"}}>{bookOnHold.bookAuthor}</span></p>
                                                <p style={{fontSize:"1.5rem", color:"#f3ffbd"}}>Rating: </p>
                                                <p style={{fontSize:"1rem", color:"black"}}>{bookOnHold.bookDiscription.split(" ").slice(0, 15).join(' ')}...</p>
                                            </div>
                                            
                                            <NavLink to={`/CheckOutBooks/${bookOnHold._id}`}>
                                                <button className={onholdmodalstyle.button}>Check Out</button>
                                            </NavLink>
                                            <button className={onholdmodalstyle.removeButton} onClick={() => handleDeletingOnHoldBook(elem)}>Remove</button>
                                        </div>
                                        
                                    </>
                                    
                                )}
                            </div>
                        )
                    })}
                </div>
            ) : ( 
                <div><h1>No books on hold</h1></div> 
            )}
            

        </div>
    )
}

export default OnHoldModal
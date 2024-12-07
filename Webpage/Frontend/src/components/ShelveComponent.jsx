import {NavLink} from "react-router-dom"
import { LibraryBig, ArrowRight } from 'lucide-react';
import axios from "axios"
import Cookies from "js-cookie";
import { useAuth } from "./AuthContext";


import shelvestyle from "../styles/shelvestyle.module.css"
import { useEffect, useState } from "react";

const backEndUrl = import.meta.env.VITE_BACKEND_URL


const ShelveComponent = () => {

    const user = useAuth()

    const [member, setMember] = useState('')
    const [allBooks, setAllBooks] = useState([])
    const [userShelfBookIds, setUserShelfBookIds] = useState([])


    //Fetch user function
    axios.defaults.withCredentials = true
    useEffect(() => {
        const fetchUserData = async () => {
            if(!user) return
            try {
                const token = Cookies.get("token")
                const response = await axios.get(`${backEndUrl}/libraryusers`, {
                    headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}
                })

                response.data.valid ? setMember(response.data) : console.error("error fetching data", response.data)

                response.data.valid ? setUserShelfBookIds(response.data.user.shelf) : console.error("error setting user shelf", response.data)
                
            } catch (error) {
                console.error("error fetching user data", error)
            }
        }
        fetchUserData()
    }, [])


    //Fetch all books function
    useEffect(() => {
        const fetchAllBooks = async () => {
            try {
                const catalogResponse = await axios.get(`${backEndUrl}/books`)
                const catalog = catalogResponse.data

                const formattedBookData = catalog.map(elem => {
                    const originalDate = new Date(elem.bookPublishDate)
                    const formattedDate = originalDate.toLocaleDateString("en-US", {
                        year : "numeric",
                        month: "2-digit",
                        day: "2-digit"
                    })

                    elem.bookPublishDate === formattedDate
                    return elem
                })

                const suggestedBooksResponse = await axios.get(`${backEndUrl}/suggestions`)
                const booksSuggested = suggestedBooksResponse.data

                const formattedSuggestedData = booksSuggested.map(elem => {
                    const originalDate = new Date(elem.bookPublishDate)
                    const formattedSuggestedDate = originalDate.toLocaleDateString('en-US', {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit"
                    })

                    elem.bookPublishDate = formattedSuggestedDate
                    return elem
                })

                const combineBooks = [...formattedBookData, ...formattedSuggestedData]

                setAllBooks(combineBooks)
                
            } catch (error) {
                console.error("error fetching data", error)
            }
        }
        fetchAllBooks()
    }, [])



    return (
        <div className={shelvestyle.componentMainContainer}>

        {allBooks && userShelfBookIds.length > 0 ? (
            < div className={shelvestyle.bookwrapper}>
                <div className={shelvestyle.componentHeader}>
                    <NavLink to="/shelf">
                        <h2>Edit Book Shelf</h2>
                    </NavLink>
                </div>
                <div className={shelvestyle.books}>
                    {userShelfBookIds.map((shelfItem, index) => (
                        <div key={index}>
                            {allBooks.find(book => book._id === shelfItem.bookid) && (
                                <NavLink to={`/BookDetails/${shelfItem.bookid}`}>
                                    <div style={{display:"flex", flexDirection:"column"}}>
                                        <img src={`${backEndUrl}/booksimages/${allBooks.find(book => book._id === shelfItem.bookid).bookImageUrl}`} alt="book image" width="100" height="150" />
                                        <div style={{textAlign:"center", color:"black"}}>
                                            {shelfItem.hasOwnProperty("completed") && shelfItem.completed && (
                                                <span>Completed</span>
                                            )}
                                            {shelfItem.hasOwnProperty("inprogress") && shelfItem.inprogress && (
                                                <span>In Progress</span>
                                            )}
                                            {shelfItem.hasOwnProperty("iown") && shelfItem.iown && (
                                                <span> Own </span>
                                            )}
                                            {shelfItem.hasOwnProperty("forlater") && shelfItem.forlater && (
                                                <span>For Later</span>
                                            )}
                                            {shelfItem.hasOwnProperty("placeholder") && shelfItem.placeholder && (
                                                <span>On Hold</span>
                                            )}
                                        </div>
                                    </div>
                                </NavLink>
                                
                            )}
                        </div>
                        
                    ))}
                </div>
                
            </div>
        ) : (
        <>
            <div className={shelvestyle.emptyShelfWrapper}>
                <div className={shelvestyle.componentHeader}>
                    <h2>Get Started</h2>
                </div>
                <div className={shelvestyle.middleWrapper}>
                    <p><LibraryBig size={48} /></p>
                    <h2>My For Later Shelf</h2>
                    <p>Keep a reference of the items you would like to read, listen to, or watch in the future. When these items become available, they will show here.</p>
                    
                </div>
            </div>
            <div className={shelvestyle.buttonWrapper}>
                <NavLink to="/Shelf">
                    <button>Go To Shelf <ArrowRight /></button>
                </NavLink>
            </div>
        </>)}

            
        </div>
    )
}

export default ShelveComponent
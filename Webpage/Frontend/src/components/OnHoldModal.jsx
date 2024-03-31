import { useState, useEffect } from "react"
import onholdmodalstyle from "../styles/onholdmodalstyle.module.css"
import { useAuth } from "./AuthContext"
import axios from "axios"
import Cookies from "js-cookie"

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
                const response = await axios.get("http://localhost:3001/libraryusers", {
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

    console.log(member)
    console.log(userShelf)
    console.log(booksOnHold)

    //fetch allbooks 
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const catalogResponse = await axios.get("http://localhost:3001/catalogbooks")
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
                
                const suggestedBooksResponse = await axios.get("http://localhost:3001/suggestedBooks")
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


    console.log(allBooks)




    return (
        <div className={onholdmodalstyle.mainContainer}>
            <div className={onholdmodalstyle.closeButtonWrapper}>
                <p onClick={(e) => {closeModal(false)}} className={onholdmodalstyle.closeButton}>x</p>
            </div>
            <div>
                
            </div>

        </div>
    )
}

export default OnHoldModal
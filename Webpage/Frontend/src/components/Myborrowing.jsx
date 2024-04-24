import { useState, useEffect } from "react"
import { useAuth } from "./AuthContext"
import axios from "axios"
import Cookies from "js-cookie"
import {Barcode, ChevronRight} from "lucide-react"

import dashboardsidebarstyle from "../styles/dashboardsidebarstyle.module.css"

import OnHoldModal from "./OnHoldModal"
import BookCheckedOutModal from "./BookCheckedOutModal"

const Myborrowing = () => {
    const {user} = useAuth()

    const [member, setMember] = useState("")
    const [userShelf, setUserShelf] = useState([])
    const [booksOnHold, setBooksOnHold] = useState([])

    const [showOnHoldModal, setShowOnHoldModal] = useState(false)
    const [showBookCheckOutModal, setShowBookCheckedOutModal] = useState(false)

    const handleShowBookCheckOutModal = () => {
        setShowBookCheckedOutModal(true)
    }

    //Fetch user function
    axios.defaults.withCredentials = true
    useEffect(() => {
        const fetchUserData = async () => {
            if(!user) return
            try {
                const token = Cookies.get("token")
                const response = await axios.get("http://localhost:3001/libraryusers", {
                    headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}
                })

                response.data.valid ? setMember(response.data) : console.error("error fetching user form database", response.data)

                response.data.valid ? setUserShelf(response.data.user.shelf) : console.error("error setting user shelf", response.data)

            } catch (error) {
                console.error("error fetching user", error)
            }
        }

        fetchUserData()
    }, [])


    //Amount of books on hold
    useEffect(() => {
        let books = []
        for(let i = 0; i < userShelf.length; i++) {
            if(userShelf[i] && userShelf[i].placeholder !== "") {
                books.push(userShelf[i].bookid)
            }
        }

        setBooksOnHold(books)
    }, [userShelf])

    
    
    const handleShowOnHoldModal = () =>{
        setShowOnHoldModal(true)
    }

    console.log(member)


    return (
        <>
            <div className={dashboardsidebarstyle.borrowMainContainer}>
                <div className={dashboardsidebarstyle.borrowingHeader}>
                    <h2><Barcode size={28} /> My Borrowing</h2>
                </div>
                <div className={dashboardsidebarstyle.CheckOutHoldFeesWrapper}>
                    <>
                        {member && member.user && member.user.checkout && (
                            <div style={{color:"black"}} onClick={handleShowBookCheckOutModal}>
                                <p>Checked Out Books</p>
                                <span>{member.user.checkout.length} <ChevronRight /></span>
                            </div>
                        )}
                    </>
                    
                    
                    <div onClick={handleShowOnHoldModal}>
                        <p>On Hold</p>
                        <span> {booksOnHold.length} <ChevronRight /></span>
                    </div>
                    <div>
                        <p>Fees</p>
                        <span>$0.00 <ChevronRight /></span>
                    </div>
                </div>
            </div>
            
            {showOnHoldModal && (<OnHoldModal  closeModal={setShowOnHoldModal}/>)}
            {showBookCheckOutModal && (<BookCheckedOutModal closeModal={setShowBookCheckedOutModal} /> )}

        </>
        
    )
}

export default Myborrowing
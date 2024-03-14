import { ArrowLeft, LibraryBig, Plus} from "lucide-react"
import { NavLink } from "react-router-dom"
import { useAuth } from "../components/AuthContext"
import { useEffect, useState } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import SearchModal from "../components/SearchModal"

import Footer from "../components/Footer"

import shelfstyle from "../styles/shelfstyle.module.css"

const Shelf = () => {

    const user = useAuth()

    const [member, setMember] = useState('')
    const [showModal, setShowModal] = useState(false)

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

            } catch (error) {
                console.error("Error fetching user data", error)
            }
        }
        fetchUserData()
    }, [])

    const handleshowmodal = () => {
        setShowModal(true)
    }


    return (
        <>
            <div className={shelfstyle.userNameContainer}>
                <div className={shelfstyle.usernameWrapper}>
                    {member && (<p style={{backgroundColor:"#720026", borderRadius:"50%", color:"white", padding:" 0 .5rem", fontSize:"2rem"}}>{member.user.userName.charAt(0).toUpperCase()}</p>)}
                    {member && (<h2>{member.user.userName}</h2>)}
                </div>
            </div>
            <div className={shelfstyle.secondHeaderContainer}>
                <NavLink to="/Dashboard">
                    <ArrowLeft className={shelfstyle.backpageArrow} />
                </NavLink>
                <div className={shelfstyle.shelvesWrapper}>
                    <LibraryBig /> 
                    <h2>My Shelves</h2> 
                    <div className={shelfstyle.completedInProgressForLaterWrapper}>
                        <p>Completed (0)</p>
                        <p>In Progress (0)</p>
                        <p>For Later (0)</p>
                    </div>
                </div>
            </div>
            <div className={shelfstyle.mainContainer}>
                <LibraryBig size={48} />
                <h2>Your shelf is empty</h2>
                <p>Add titles to your shelf to keep track of items you want to read, listen to, and watch in the future</p>
                <button onClick={handleshowmodal}><Plus />Add a title</button>
            </div>
            {showModal && (<SearchModal closeModal={setShowModal} />)}
            <div>
                <Footer />
            </div>
        </>
    )
}

export default Shelf
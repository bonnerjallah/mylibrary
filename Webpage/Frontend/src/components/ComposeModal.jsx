import { useState, useEffect } from 'react';
import axios from "axios"
import Cookies from "js-cookie"
import { useAuth } from './AuthContext';

import { Send, MessageCircleOff, ChevronDown } from 'lucide-react';
import composemodalstyle from "../styles/composemodalstyle.module.css"



const ComposeModal = ({closeModal}) => {

    const user = useAuth()

    const [member, setMember] = useState("")
    const [followers, setFollowers] = useState([])
    const [allUsers, setAllUsers] = useState([])
    const [openContacts, setOpenContacts] = useState(false)
    const [selectedContact, setSelectedContact] = useState("")

    const handleOpenContacts = () => {
        setOpenContacts(!openContacts)
    }

    const handleSelectedContact = (e) => {
        const selected = e.target.textContent
        setSelectedContact(selected)
        setOpenContacts(false)
    }



    //Fetch user data function
    axios.defaults.withCredentials = true
    useEffect(() => {
        if(!user)return
        const fetchUserData = async () => {
            try {
                const token = Cookies.get("token")
                const response = await axios.get("http://localhost:3001/libraryusers", {
                    headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}
                })

                response.data.valid ? setMember(response.data) : console.error("Invalid user data", response.data)

                response.data.valid ? setFollowers(response.data.user.followers) : console.error("Invalid user cant find followers", response.data)

            } catch (error) {
                console.error("error fetching user data", error)
            }
        }
        fetchUserData()
    }, [])

    //Fetch all user function
    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const response = await axios.get("http://localhost:3001/usersToFollow")
                setAllUsers(response.data)

            } catch (error) {
                console.error("error fetching all users", error)
            }
        }
        fetchAllUsers(  )
    }, [])

    console.log(member)
    // console.log("allusers", allUsers)
    // console.log("followers", followers)

    return (
        <div className={composemodalstyle.mainContainer}>
            <p onClick={(e) => {closeModal(false)}}>X</p>
            <div className={composemodalstyle.messageBoxWrapper}>
                <div className={composemodalstyle.userAndContactWrapper}>
                    <div className={composemodalstyle.userWrapper}>
                        {member.user && (
                            <img src={`http://localhost:3001/libraryusersprofilepics/${member.user.profilepic}`} alt={member.user.userName} width="70" height="70"  style={{borderRadius:"1rem"}} />
                        )}
                    </div>
                    <div className={composemodalstyle.contactWrapper}>
                        <h3 className={composemodalstyle.contactOpenButton} onClick={handleOpenContacts}>Contacts <ChevronDown /></h3>
                        {allUsers && followers && (
                            <div className={openContacts ? composemodalstyle.showcontacts : composemodalstyle.contacts}>
                                {allUsers.filter(user => followers.includes(user._id)).map((elem, index) => (
                                    <div key={index} className={composemodalstyle.contact}>
                                        <img src={`http://localhost:3001/libraryusersprofilepics/${elem.profilepic}`} alt='' width="20" height="20" style={{borderRadius:"50%"}} />
                                        <span onClick={(e) => {handleSelectedContact(e)}}>{elem.username}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className={composemodalstyle.composeFormWrapper}>
                    <form >
                        <h5>To: <span style={{color:"white"}}>{selectedContact} </span></h5>
                        <label htmlFor="ComposeMessage"></label>
                        <textarea name="sendMsg" id="" cols="30" rows="10"></textarea>
                        <div>
                            <button className={composemodalstyle.sendButton}><Send />Send</button>
                            <button className={composemodalstyle.cancleButton}><MessageCircleOff />Cancle</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ComposeModal
import { useState, useEffect } from 'react';
import axios from "axios"
import Cookies from "js-cookie"
import { useAuth } from './AuthContext';

import { Send, MessageCircleOff, ChevronDown } from 'lucide-react';
import composemodalstyle from "../styles/composemodalstyle.module.css"

const backEndUrl = import.meta.env.VITE_BACKEND_URL


const ComposeModal = ({closeModal}) => {

    const user = useAuth()

    const [member, setMember] = useState("")
    const [followers, setFollowers] = useState([])
    const [allUsers, setAllUsers] = useState([])
    const [openContacts, setOpenContacts] = useState(false)
    const [selectedContact, setSelectedContact] = useState("")
    const [message, setMessage] = useState({
        sendMsg : ""
    })

    const [confermMsgSent, setConfermMsgSent] = useState("")


    //handle open contact dropdown
    const handleOpenContacts = () => {
        setOpenContacts(!openContacts)
    }

    //select contact function
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
                const response = await axios.get(`${backEndUrl}/libraryusers`, {
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
                const response = await axios.get(`${backEndUrl}/usersToFollow`)
                setAllUsers(response.data)

            } catch (error) {
                console.error("error fetching all users", error)
            }
        }
        fetchAllUsers(  )
    }, [])

    //handle textarea input data
    const handleComposeInput = (e) => {
        const {name, value} = e.target

        setMessage((prev) => ({...prev, [name]: value}))
    }

    console.log(allUsers)
    console.log(selectedContact)

    const handleComposeFormSubmit = async (e) => {
        e.preventDefault()

        const reciever = allUsers.find(elem => elem.username === selectedContact)

        const requestObject = {
            senderId : member.user.id,
            senderName : member.user.userName,
            senderProfilePic : member.user.profilepic,
            message : message.sendMsg,
            receiverId : reciever._id
        }

        try {
            const response = await axios.post(`${backEndUrl}/sendmessage`, requestObject , {
                headers: {"Content-Type": "application/json"}
            })
        
            if(response.status === 200) {
                console.log("successfully send message")
                setConfermMsgSent("Message sent")

                setTimeout(() => {
                    setConfermMsgSent("")
                }, 2000);
            }

            setMessage({
                sendMsg : ""
            })

            setSelectedContact("")

            
        } catch (error) {
            console.log("error sending message", error)
        }
    }


    return (
        <div className={composemodalstyle.mainContainer}>
            <p onClick={(e) => {closeModal(false)}}>X</p>
            <div className={composemodalstyle.messageBoxWrapper}>
                <div className={composemodalstyle.userAndContactWrapper}>
                    <div className={composemodalstyle.userWrapper}>
                        {member.user && (
                            <img src={`${backEndUrl}/libraryusersprofilepics/${member.user.profilepic}`} alt={member.user.userName} width="70" height="70"  style={{borderRadius:"1rem"}} />
                        )}
                    </div>
                    <div className={composemodalstyle.contactWrapper}>
                        <h3 className={composemodalstyle.contactOpenButton} onClick={handleOpenContacts}>Contacts <ChevronDown /></h3>
                        {allUsers && followers && (
                            <div className={openContacts ? composemodalstyle.showcontacts : composemodalstyle.contacts}>
                                {allUsers.filter(user => followers.includes(user._id)).map((elem, index) => (
                                    <div key={index} className={composemodalstyle.contact}>
                                        <img src={`${backEndUrl}/libraryusersprofilepics/${elem.profilepic}`} alt='' width="20" height="20" style={{borderRadius:"50%"}} />
                                        <span onClick={(e) => {handleSelectedContact(e)}}>{elem.username}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className={composemodalstyle.composeFormWrapper}>
                    <form onSubmit={handleComposeFormSubmit} encType='mulitpart/form-data' method='POST' >
                        <h5>To: <span style={{color:"white"}}>{selectedContact} </span></h5>
                        <label htmlFor="ComposeMessage"></label>
                        <textarea name="sendMsg" id="" cols="30" rows="10" value={message.sendMsg} onChange={handleComposeInput}></textarea>
                        <div>
                            <button type='submit' className={composemodalstyle.sendButton}><Send />Send</button>
                            <button className={composemodalstyle.cancleButton}><MessageCircleOff />Cancle</button>
                        </div>
                    </form>
                </div>
            </div>
            {confermMsgSent && (<p className={composemodalstyle.confermMessageSent}>{confermMsgSent}</p>)}
        </div>
    )
}

export default ComposeModal
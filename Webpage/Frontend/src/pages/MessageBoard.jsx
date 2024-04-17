import { useState, useEffect } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import { useAuth } from "../components/AuthContext"
import {NavLink} from "react-router-dom"

import {Home, Pen, Inbox, Bell, Contact, LayoutDashboard, Mail} from 'lucide-react';
import messagemodalstyle from "../styles/messagemodalstyle.module.css"

import ReadMessageModal from "../components/ReadMessageModal"
import ComposeModal from "../components/ComposeModal"

const MessageBoard = () => {

    const user = useAuth()

    const [member, setMember] = useState('')
    const [allUsers, setAllUsers] = useState('')
    const [showContact, setShowContact] = useState(false)
    const [showNotification, setShowNotification] = useState(false)
    const [showInbox, setShowInbox] = useState(true)
    const [showReadMessageModal, setShowReadMessageModal] = useState(false)
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showComposeBox, setShowComposeBox] = useState(false)


    const handleReadMessageModal = (elem) => {
        setShowReadMessageModal(true); 
        setSelectedMessage(elem); 
    };
    
    


    //Fetch user data
    axios.defaults.withCredentials = true
    useEffect(() => {
        const fetchUserData = async () => {
            if(!user) return
            try {
                const token = Cookies.get("token")
                const response = await axios.get("http://localhost:3001/libraryusers", {
                    headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}
                })

                response.data.valid ? setMember(response.data) : console.error("Invalid user data", response.data)

            } catch (error) {
                console.error("error fetching user data", error)
            }
        }
        fetchUserData()
    }, [])

    //Fetch all user
    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const response = await axios.get("http://localhost:3001/usersToFollow")
                setAllUsers(response.data)
            } catch (error) {
                console.log("error fetching all users", error)
            }
        }
        fetchAllUsers()
    }, [])

    //Contact state function
    const handleShowContact = () => {
        setShowContact(!showContact)
    }

    //Notification state function
    const handleShowNotification = () => {
        setShowNotification(true)
        setShowInbox(false)
    }
    
    //Inbox state Function
    const handleShowInbox = () => {
        setShowInbox(true)
        setShowNotification(false)
    }

    //Callback function to update deleted message state
    const handleDeleteMessage = (deletedMsgId) => {

        setMember(prevMember => {
            const updatedMessages = prevMember.user.messages.filter(msg => msg._id !== deletedMsgId)
            return {
                ...prevMember,
                user: {
                    ...prevMember.user,
                    messages: updatedMessages
                }
            }
        })

    };

    const handleShowComposeBox = () => {
        setShowComposeBox(true)
        setShowContact(false)
    }

    console.log("all users", allUsers)
    console.log("member", member)


    return (
        <div className={messagemodalstyle.messageBoardMainContainer}>
            <div className={messagemodalstyle.msgBoardHeaderWrapper}>
                <p>Welcome <span style={{backgroundColor:"#720026", borderRadius:"50%", color:"white", padding:" 0 .5rem"}}>{member && member.user.userName.charAt(0).toUpperCase()}</span> {member && member.user.userName} !!</p>
                <h1>My Message Board</h1>
            </div>
            <div style={{display:"flex", columnGap:"1rem", backgroundColor:"#a3b18a", padding:"1rem", alignItems:"center"}}>

                <NavLink to="/" >
                    <div className={messagemodalstyle.navbarIcon}><Home />Home</div> 
                </NavLink>
                <NavLink to="/Dashboard">
                    <div className={messagemodalstyle.navbarIcon}><LayoutDashboard />My DashBoard</div>
                </NavLink>
            </div>

            <div className={messagemodalstyle.messageContainer}>

                <div className={messagemodalstyle.sideBarWrapper}>
                    <div className={messagemodalstyle.composeButtonWrapper}>
                        <button onClick={handleShowComposeBox}><Pen /> Compose</button>
                    </div>

                    <div className={messagemodalstyle.inboxBellContactWrapper}>
                        <div onClick={handleShowInbox}> <Inbox /> Inbox ({member && member.user.messages && member.user.messages.length})</div>
                        <div onClick={handleShowNotification}> <Bell /> Notification ()</div>
                        <div onClick={handleShowContact}> <Contact /> Contacts </div>
                    </div>
                    <div className={showContact ? messagemodalstyle.showcontactsContainer : messagemodalstyle.contactsContainer}>
                            {member && allUsers && (
                                <>
                                    {allUsers.filter(user => member.user.followers.includes(user._id)).map((contactElem, index) => (
                                        <div key={index} className={messagemodalstyle.contactWrapper}>
                                            <img src={`http://localhost:3001/libraryusersprofilepics/${contactElem.profilepic}`} alt="user image" width="30" height="30" style={{borderRadius:"50%"}}  />
                                            <div onClick={handleShowComposeBox}>
                                                {contactElem.username}
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                </div>

                <div className={messagemodalstyle.messageWrapper} style={{ display: showNotification ? 'block' : 'none' }}>
                    <h5 style={{textAlign:"center"}}>Notification</h5>                        
                    <div>
                        {member && member.user.messages.map((elem, index) => (
                            <div key={index} className={messagemodalstyle.message}>
                                <div style={{display:"flex", alignItems:"center", columnGap:'.5rem'}}>   
                                    <label htmlFor={`NotifiSelectMsg_${index}`}></label>
                                    <input type="checkbox" name="select" id={`NotifiSelectMsg_${index}`} />
                                    <Mail size={20} />
                                </div>
                                <div style={{fontWeight:"bold"}}>
                                    {elem.senderName}
                                </div>
                                <div>
                                    {elem.content.split(' ').slice(0, 10).join(' ')} ...
                                </div>
                                <div style={{display:"flex", position:"absolute", right:"1rem"}}>
                                    {new Date(elem.date).toLocaleString("en-Us", {
                                        year:"numeric",
                                        month:"short",
                                        day:"2-digit",
                                        hour:"2-digit",
                                        minute:"numeric"
                                    })}
                                </div>
                            </div>
                        ))}
                        
                    </div>
                </div>

                <div className={ messagemodalstyle.messageWrapper} style={{ display: showInbox ? 'block' : 'none' }}>
                    <h5 style={{textAlign:"center"}}>Messages</h5>                        
                    <div>
                        {member && member.user.messages && member.user.messages.map((elem, index) => (
                            <div key={index} className={messagemodalstyle.message} onClick={() =>handleReadMessageModal(elem)}>
                                <div style={{display:"flex", alignItems:"center", columnGap:'.5rem'}}>   
                                    <label htmlFor={`SelectMsg_${index}`}></label>
                                    <Mail size={20} />
                                </div>
                                <div style={{fontWeight:"bold"}}>
                                    {elem.senderName}
                                </div>
                                <div>
                                    {elem.content.split(' ').slice(0, 10).join(' ')} ...
                                </div>
                                <div style={{display:"flex", position:"absolute", right:"1rem"}}>
                                    {new Date(elem.date).toLocaleString("en-Us", {
                                        year:"numeric",
                                        month:"short",
                                        day:"2-digit",
                                        hour:"2-digit",
                                        minute:"numeric"
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {showReadMessageModal && (<ReadMessageModal close={setShowReadMessageModal} message={selectedMessage}  deletedMessage={handleDeleteMessage} />)}
            {showComposeBox && (<ComposeModal closeModal={setShowComposeBox}  />)}
        </div>
    )
}

export default MessageBoard
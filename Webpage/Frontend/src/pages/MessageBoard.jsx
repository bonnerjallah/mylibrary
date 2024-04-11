import { useState, useEffect } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import { useAuth } from "../components/AuthContext"
import {NavLink} from "react-router-dom"

import { ChevronUp, Home, Pen, Inbox, Bell, Contact, LayoutDashboard, Mail} from 'lucide-react';


import messagemodalstyle from "../styles/messagemodalstyle.module.css"

const MessageBoard = () => {

    const user = useAuth()

    const [member, setMember] = useState('')
    const [allUsers, setAllUsers] = useState('')
    const [showContact, setShowContact] = useState(false)
    const [personRecieving, setPersonRecieving] = useState({
        recv : "",
    })
    const [inputMessage, setInputMessage] = useState({
        sendmsg : ""
    })

    const [messageSent, setMessageSent] = useState({})




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

    const handleShowContact = () => {
        setShowContact(!showContact)
    }

    const handlepersonRecieving = (e) => {
        const person = e.target.textContent.trim(); // Trim leading and trailing whitespace
        setPersonRecieving((prev) => ({...prev, recv : person}));

        setTimeout(() => {
            setShowRecievers(!showReciever)
        }, 100);
    };
    

    const handleInputData = (e) => {
        const {name, value} = e.target

        setInputMessage((prev) => ({...prev, [name]: value}))
    }

    const handleMessageSubmit = async (e) => {
        e.preventDefault();

        const reciever = allUsers.find(elem => elem.username === personRecieving.recv)
        const receiverId = reciever._id
        

        const requestObject = {
            senderId : member.user.id,
            senderName : member.user.userName,
            senderProfilePic : member.user.profilepic,            
            message : inputMessage.sendmsg,
            receiverId 
        }

        console.log("obje", requestObject)

        try {
            const response = await axios.post("http://localhost:3001/sendmessage", requestObject, {
                headers: {"Content-Type": "application/json"}
            })

            if(response.status === 200) {

                    setTimeout(() => {
                        setMessageSent("Message sent")
                    }, 1000);
            }

            setPersonRecieving({
                recv: "",
            })

            setInputMessage({
                sendmsg:""
            })
            
        } catch (error) {
            console.log("error sending message", error)
        }
    }





    console.log(allUsers)
    console.log(member)

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
                        <button><Pen /> Compose</button>
                    </div>

                    <div className={messagemodalstyle.inboxBellContactWrapper}>
                        <div> <Inbox /> Inbox ({member && member.user.messages && member.user.messages.length})</div>
                        <div> <Bell /> Notification ()</div>
                        <div onClick={handleShowContact}> <Contact /> Contacts </div>
                    </div>
                    <div className={showContact ? messagemodalstyle.showcontactsContainer : messagemodalstyle.contactsContainer}>
                            {member && allUsers && (
                                <>
                                    {allUsers.filter(user => member.user.followers.includes(user._id)).map((contactElem, index) => (
                                        <div key={index} className={messagemodalstyle.contactWrapper}>
                                            <img src={`http://localhost:3001/libraryusersprofilepics/${contactElem.profilepic}`} alt="user image" width="30" height="30" style={{borderRadius:"50%"}}  />
                                            <div>
                                                {contactElem.username}
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                </div>

                <div className={messagemodalstyle.messageWrapper}>
                    <h5 style={{textAlign:"center"}}>Messages</h5>
                    <div className={messagemodalstyle.message}>
                        <div style={{display:"flex", alignItems:"center", columnGap:'.5rem'}}>   
                            <label htmlFor="Select"></label>
                            <input type="checkbox" name="select" id="Select" />
                            <Mail size={20} />
                        </div>
                        <div style={{display:"flex", justifyContent:"space-between", width:"70%", position:"absolute", right:"4rem"}}>
                            {member && member.user.messages.map((elem, index) => (
                                <div key={index} style={{display:"flex", flexDirection:'column'}}>
                                    <div>
                                        {elem.senderName}
                                    </div>
                                    <div>
                                        {elem.content}
                                    </div>
                                    <div style={{display:"flex"}}>
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

            </div>
        </div>
    )
}

export default MessageBoard
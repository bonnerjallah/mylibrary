import { useState, useEffect } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import { useAuth } from "../components/AuthContext"

import { ChevronUp } from 'lucide-react';


import messagemodalstyle from "../styles/messagemodalstyle.module.css"

const MessageBoard = () => {

    const user = useAuth()

    const [member, setMember] = useState('')
    const [allUsers, setAllUsers] = useState('')
    const [showReciever, setShowRecievers] = useState(false)
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

    const handleShowRecievers = () => {
        setShowRecievers(!showReciever)
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





    // console.log(allUsers)
    // console.log(member)

    return (
        <div className={messagemodalstyle.messageBoardMainContainer}>
            <div className={messagemodalstyle.msgBoardHeaderWrapper}>
                <h1>My Message Board</h1>
                <p>Welcome <span style={{backgroundColor:"#720026", borderRadius:"50%", color:"white", padding:" 0 .5rem"}}>B</span> bsmoke !!</p>
            </div>
            <div className={messagemodalstyle.notificationsSectionContainer}>
                <h2>Notifications</h2>
                <div>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe recusandae odio magnam incidunt repudiandae doloremque numquam, sint quisquam culpa facere!
                </div>
            </div>
            <div className={messagemodalstyle.sendMessageContainer}>
                <h2>Send Message</h2>
                <div className={messagemodalstyle.msgBoardFormWrapper}>
                    <form onSubmit={handleMessageSubmit} encType="form-data" method="POST">
                        <div className={messagemodalstyle.recieverName}>
                            <>
                                <div className={showReciever ? messagemodalstyle.displayRecievers : messagemodalstyle.recieverMainContainer}>
                                    {member && allUsers && (
                                        <ul>
                                            {allUsers.filter(user => member.user.following.some(elem => elem === user._id)).map((users, index) => (
                                                <li key={index} className={messagemodalstyle.recieverWrapper} onClick={(e) => {handlepersonRecieving(e)}}>
                                                    <img src={`http://localhost:3001/libraryusersprofilepics/${users.profilepic}`}  alt="" width= "25" height="25" style={{borderRadius:"50%"}}/> {users.username}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <p className={messagemodalstyle.recieverButton} onClick={handleShowRecievers}>Reciever <ChevronUp /> </p>
                            </>
                            <input type="text" name="recv" id="revieverName" placeholder="Reciever" value={personRecieving.recv} onChange={handlepersonRecieving} />
                        </div>
                        <label htmlFor="SendMessage"></label>
                        <textarea name="sendmsg" id="SendMessage" cols="30" rows="10" onChange={handleInputData} value={inputMessage.sendmsg}></textarea>

                        <button type='submit'>Send</button>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default MessageBoard
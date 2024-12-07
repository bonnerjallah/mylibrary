import { useState, useEffect } from "react";
import messagemodalstyle from "../styles/messagemodalstyle.module.css"
import { MessageCircleReply, Trash2, Send, MessageCircleOff } from 'lucide-react';
import axios from "axios";
import Cookies from "js-cookie"
import { useAuth } from "./AuthContext";

const backEndUrl = import.meta.env.VITE_BACKEND_URL



const ReadMessageModal = ({ close, message, deletedMessage }) => {

    const {user} = useAuth()
    console.log(message)

    const [member, setMember] = useState('')
    const [showReplyBox, setShowReplyBox] = useState(false)
    const [inputData, setInputData] = useState({
        sendMsg : ""
    })
    const [messageSent, setMessageSent] = useState("")
    const [messageDeleted, setMessageDeleted] = useState(false)



    axios.defaults.withCredentials = true
    useEffect(() => {
        if(!user)return
        const fetchAllUsers = async () => {
            const token = Cookies.get("token")
            const response = await axios.get(`${backEndUrl}/libraryusers`, {
                headers:{"Content-Type" : "application/json", "Authorization": `Bearer ${token}`}
            })

            response.data.valid ? setMember(response.data) : console.error("error fetching user data", response.data)
        }
        fetchAllUsers()
    }, [])

    //Show reply box function
    const handleShowReplyBox = () => {
        setShowReplyBox(true)
    }

    //close reply box function
    const hadleCloseReply = () => {
        setShowReplyBox(false)
    }

    //handle reply data
    const handleInputData = (e) => {
        const {name, value} = e.target
        setInputData((prev) => ({...prev, [name]: value}))
    }

    //Submiting reply function
    const handleReplyMessageSubmit = async (e) => {
        e.preventDefault()

        const requestObject = {
            senderId : member.user.id,
            senderName : member.user.userName,
            senderProfilePic : member.user.profilepic,
            message : inputData.sendMsg,
            receiverId : message.senderId
        }

        try {
            const response = await axios.post(`${backEndUrl}/sendmessage`, requestObject, {
                headers: {"Content-Type": "application/json"}
            })

            if(response.status === 200) {
                setMessageSent("Message Sent Successfully")
                setTimeout(() => {
                    setMessageSent("")
                }, 2000);
            }

            setInputData({
                sendMsg:""
            })


            setTimeout(() => {
                setShowReplyBox(false)
            }, 2500)

        } catch (error) {
            console.log("error sending mesage", error)
        }
    }

    const handleMessageDelete = async (_id) => {
        const userId = member.user.id;
        const msgId = _id;
    
    
        try {
            const response = await axios.delete(`${backEndUrl}/deleteMessages/${userId}/${msgId}`);
    
            if (response.status === 200) {
                console.log("successfully deleted message");
                
                deletedMessage(msgId); // Pass the deleted message ID back to the parent
            }

            

            close(false)
    
        } catch (error) {
            console.log("error deleting user data", error);
            // Optionally show an error message to the user
        }
    }
    


    return (
        <div className={messagemodalstyle.msgModalMainContainer}>
                <p onClick={(e) => {close(false)}}>X</p>
                <div className={messagemodalstyle.readContainer}>
                    <div className={messagemodalstyle.senderPicAndNameWrapper}>
                        <div>
                            {message && (
                                <img src={`${backEndUrl}/libraryusersprofilepics/${message.senderProfilePic}`} alt="" width="100" height="100" style={{borderRadius:"50%"}} />
                            )}
                        </div>
                        <div style={{fontSize:"1.3rem", fontWeight:"bold"}}>
                            {message.senderName}
                        </div>
                    </div>
                    <div className={messagemodalstyle.messageWrapper}>
                        {message.content} 

                        {showReplyBox ? (
                            <form onSubmit={handleReplyMessageSubmit} encType="multi-part" method="POST">
                                <label htmlFor="SendMessage"></label>
                                <textarea name="sendMsg" id="SendMessage" cols="30" rows="10" placeholder="Reply" onChange={handleInputData} value={inputData.sendMsg}></textarea>
                                <div >
                                    <button type="submit" style={{border:"none"}} className={messagemodalstyle.sendButton}><Send />Send</button>
                                    <button className={messagemodalstyle.cancleButton} onClick={hadleCloseReply}><MessageCircleOff />Cancle</button>
                                </div>
                            </form>
                        ) : (
                            ""
                        )}
                        
                    </div>

                </div>

                {showReplyBox ? ( " " ) : (
                    <div className={messagemodalstyle.ButtonWrapper}>
                    <button onClick={handleShowReplyBox}> <MessageCircleReply size={25}/>Reply</button>
                    <button onClick={() => handleMessageDelete(message._id)}> <Trash2 size={25} />Delete</button>
                </div>
                )}
                
                {messageSent && (<p className={messagemodalstyle.sentNotification}>{messageSent}</p>)}
        </div>
    )
}

export default ReadMessageModal
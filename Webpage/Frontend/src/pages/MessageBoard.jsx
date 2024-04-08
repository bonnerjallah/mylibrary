import { useState, useEffect } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import { useAuth } from "../components/AuthContext"


import messagemodalstyle from "../styles/messagemodalstyle.module.css"

const MessageBoard = () => {

    const user = useAuth()

    const [member, setMember] = useState('')
    const [allUsers, setAllUsers] = useState('')

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

    console.log(allUsers)
    console.log(member)

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
                    <form>
                        <div className={messagemodalstyle.recieverName}>
                            <label htmlFor="RecieverName" style={{color:"white", marginRight:".5rem"}}> Send To</label>
                            <input type="text" name='reciever' id='RecieverName' placeholder='Reciever' />
                        </div>
                        <label htmlFor="SendMessage"></label>
                        <textarea name="sendmsg" id="SendMessage" cols="30" rows="10"></textarea>

                        <button type='submit'>Send</button>

                    </form>
                </div>
            </div>

        </div>
    )
}

export default MessageBoard
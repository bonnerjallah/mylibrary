import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from "js-cookie"
import { useAuth } from './AuthContext';

import { Menu } from 'lucide-react';
import postboxstyle from "../styles/postboxstyle.module.css"


const Postsbox = () => {

    const {user} = useAuth()

    const [member, setMember] = useState("")
    const [allUsers, setAllUsers] = useState([])

    //fetching user data
    axios.defaults.withCredentials = true
    useEffect(() => {
        if(!user)return
        const fetchUserData = async () => {
            try {
                const token = Cookies.get("token")
                const response = await axios.get("http://localhost:3001/libraryusers", {
                    headers:{"Content-Type": "application/json", "Authorization": `Bearer ${token}`}
                })

                response.data.valid ? setMember(response.data) : console.error("error fetching user form database", response.data)
                
            } catch (error) {
                console.error("error fetching user data", error)
            }
        }
        fetchUserData()
    }, [])

    console.log("User data", member)

    //fetching all users
    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const response = await axios.get("http://localhost:3001/usersToFollow")
                setAllUsers(response.data)
            } catch (error) {
                console.log("Error fetch all user", error)
            }
        }
        fetchAllUsers()
    }, [])

    console.log("all users", allUsers)

    return (
        <div className={postboxstyle.mainContainer}>
            {allUsers && allUsers.map((user, id) => (
                user.posts.length > 0 && (
                    <div key={id}>
                        <div className={postboxstyle.headerContainer}>
                            <div className={postboxstyle.postImageAndContainer}>
                                <div className={postboxstyle.posterImageWrapper}>
                                    <img src={`http://localhost:3001/libraryusersprofilepics/${user.profilepic}`} width="50" height="50" style={{borderRadius:"50%"}} />
                                    <p>{user.username}</p>
                                </div>
                                <div className={postboxstyle.menuAndCloseWrapper}>
                                    <Menu className={postboxstyle.menuIcon} />
                                    <p>X</p>
                                </div>
                            </div>
                            <div className={postboxstyle.whatsPostedWrapper}>
                                {user.posts[user.posts.length - 1].postcontent}
                            </div>
                        </div>

                        <div className={postboxstyle.WhatsPostedImageWrapper}>
                            <img src={`http://localhost:3001/postpictures/${user.posts[user.posts.length - 1].postpic}`}         className={postboxstyle.WhatsPostedImage} />
                        </div>

                        <div className={postboxstyle.commentFormWrapper}>
                            {member && member.user && member.user.profilepic && (
                                <form>
                                    <div className={postboxstyle.likesContainer}>
                                        likes
                                    </div>
                                    <div className={postboxstyle.commentLeaverContainer}>
                                        <div className={postboxstyle.commentWrapper}>
                                            <img src={`http://localhost:3001/libraryusersprofilepics/${member.user.profilepic}`} width="40" height="40" style={{borderRadius:"50%"}} />
                                        </div>
                                        <label htmlFor="Comment">
                                            <input type="text" name='comment' id='Comment' placeholder='Write a comment' />
                                        </label>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                )
            ))}
            
            
            
        </div>
    )
}

export default Postsbox
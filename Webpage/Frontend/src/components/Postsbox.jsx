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
            <div className={postboxstyle.headerContainer}>
                <div className={postboxstyle.postImageAndContainer}>
                    <div className={postboxstyle.posterImageWrapper}>
                    </div>
                    <div className={postboxstyle.menuAndCloseWrapper}>
                        <Menu />
                        <p>X</p>
                    </div>
                </div>
                <div className={postboxstyle.whatsPostedWrapper}>
                    post goes here
                </div>
            </div>
            <div className={postboxstyle.WhatsPostedImageWrapper}>
                post pic goes here
            </div>
            <div className={postboxstyle.commentFormWrapper}>
                <form>
                    <div className={postboxstyle.likesContainer}>
                        likes
                    </div>
                    <div className={postboxstyle.commentLeaverContainer}>
                        <div className={postboxstyle.commentWrapper}>
                            page holder profile pic
                            <label htmlFor="Comment">
                                <input type="text" name='comment' id='Comment' placeholder='Write a comment' />
                            </label>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Postsbox
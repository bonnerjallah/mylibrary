import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie"
import { useAuth } from "../components/AuthContext";


import { Search  } from 'lucide-react';

import poststyle from "../styles/poststyle.module.css"


const PostContainer = () => {

    const {user} = useAuth()

    const [member, setMember] = useState()
    const [allUsers, setAllUsers] = useState()

    //user fetch data
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

    console.log(member)

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

    return (
        <div className={poststyle.postMainContainer}>
            <div className={poststyle.postSideContainer}>
                <div>
                    {member && member.user && member.user.profilepic && member.user.userName && (
                        <div style={{display:"flex", alignItems:"center", columnGap:"1rem"}}>
                            <img src={`http://localhost:3001/libraryusersprofilepics/${member.user.profilepic}`} alt=""  width="35" height="35" style={{borderRadius:"50%"}} />
                            <p>
                                {member.user.userName}
                            </p>
                        </div>
                    )}
                    
                </div>
                <p>Friends</p>
                <p>Members</p>
                <p>Saved</p>
                <p>Events</p>
                <p>Messages</p>
            </div>
            <div className={poststyle.postContainer}>
                <div className={poststyle.followingPost}>
                    following
                </div>
                <div>
                    posts goes here
                </div>

            </div>
            <div className={poststyle.rightSideContainer}>
                <div className={poststyle.peopleYouMayKnowWrapper}>
                    <h4>People you may Know</h4>
                    <p>See all</p>
                </div>
                <div className={poststyle.contactsWrapper}>
                    <h4>Contacts</h4>
                    <Search />
                </div>

            </div>
        </div>
    )
}

export default PostContainer
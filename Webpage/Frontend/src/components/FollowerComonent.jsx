import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

import shelvestyle from "../styles/shelvestyle.module.css"

import { UserRoundPlus } from 'lucide-react';




const FollowerComonent = () => {

    const [allMembers, setAllMembers] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState('')

    const [followingError, setFollowingError] = ("")

    const handleRequestToFollow = async (_id) => {
        try {
            
            if(!_id ) {
                console.log("Invalid member to follow", error)
                return
            }

            console.log("_id", _id)

            const requestBody = {
                _id : _id,
                userId : loggedInUser.user.id
            }

            console.log("request Body", requestBody)

            const response = await axios.post("http://localhost:3001/followRequest", requestBody, {
                headers: {"Content-Type": "application/json"}
            })

            if(response.status === 200) {
                console.log("Follow user successfully")

            }

        } catch (error) {
            console.log("Error following user", error)
            if(error.response) {
                console.log(setFollowingError(error.response.error))
            }
        }
    }

    axios.defaults.withCredentials = true
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = Cookies.get("token")
                const userResponse = await axios.get("http://localhost:3001/libraryusers", {
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
                })
                userResponse.data.valid ? setLoggedInUser(userResponse.data) : console.error("Error fetching logged in user", userResponse.data)
            } catch (error) {
                console.error("Error fetching user data", error)
            }
        }

        const fetchAllUser = async () => {
            try {
                const allMemberResponse = await axios.get("http://localhost:3001/usersToFollow")
                setAllMembers(allMemberResponse.data)
            } catch (error) {
                console.error("Error fetching all members", error)
            }
        }

        fetchUserData()
        fetchAllUser()
    }, [])

    console.log(allMembers)
    console.log(loggedInUser)

    return (
        <div className={shelvestyle.followMainContainer}>
            <div className={shelvestyle.followMainContainerHeader}>
                <h2>Follow And Get Ideas</h2>
            </div>
            <div className={shelvestyle.userIconWrapper}>
                <UserRoundPlus size={90} fill="black" />
                <h2>To get ideas and discover new titles to borrow, follow library staff and other members</h2>
            </div>
            <div className={shelvestyle.followerContainer}>
                <div className={shelvestyle.allFollowersWrapper}>
                    {allMembers.map((member) => (
                        // Check if the user is not the logged-in user
                        loggedInUser && member._id !== loggedInUser.user.id && (
                            <div key={member._id} className={shelvestyle.followerWrapper}>
                                <div className={shelvestyle.userWrapper}>
                                    <div className={shelvestyle.userImageWrapper}>
                                        <img src={`http://localhost:3001/libraryusersprofilepics/${member.profilepic}`} alt="Profile pic" style={{borderRadius:"50%"}} width="50" height="50" />
                                    </div>
                                    <div>
                                        <p>@{member.username}</p>
                                        <p>{member && member.reviewer === true ? (
                                            <span style={{color:"#2ec4b6"}}>Reviewer </span>
                                        ) : (
                                            <span style={{color:"#0466c8"}}>Reader</span>
                                        ) }</p>
                                    </div>
                                </div>
                                <div onClick={() => handleRequestToFollow(member._id)} className={shelvestyle.followButtonWrapper}>
                                    <p style={{backgroundColor: "#ffe14c", borderRadius:"2rem", width:"5rem", height:"2rem", display:"flex", justifyContent:"center", alignItems:"center", color:"white" }}> Follow </p>
                                </div>
                            </div>
                        )
                    ))}
                </div>
            </div>
            


        </div>
    )
}

export default FollowerComonent
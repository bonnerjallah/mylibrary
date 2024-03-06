import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

import shelvestyle from "../styles/shelvestyle.module.css"

import { UserRoundPlus } from 'lucide-react';




const FollowerComonent = () => {

    const [allMembers, setAllMembers] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState('')

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

    console.log("logged in User", loggedInUser)
    console.log("all members", allMembers)


    return (
        <div className={shelvestyle.followMainContainer}>
            <div className={shelvestyle.followMainContainerHeader}>
                <h2>Follow And Get Ideas</h2>
            </div>
            <div className={shelvestyle.userIconWrapper}>
                <UserRoundPlus size={90} fill="black" />
                <h2>To get ideas and discover new titles to borrow, follow library staff and other members</h2>
            </div>
            <div className={shelvestyle.followersWrapper}>
                {allMembers.map((member) => (
                    // Check if the user is not the logged-in user
                    loggedInUser && member._id !== loggedInUser.user.id && (
                        <div key={member._id}>
                            <p>{member.username}</p>
                        </div>
                    )
                ))}
            </div>


        </div>
    )
}

export default FollowerComonent
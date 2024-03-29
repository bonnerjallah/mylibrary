import { useEffect, useState } from "react";

import dashboardstyle from "../styles/dashboardstyle.module.css"
import { useAuth } from "../components/AuthContext";

import axios from "axios";
import Cookies from "js-cookie";

import Myborrowing from "../components/Myborrowing";
import Myprofilebox from "../components/Myprofilebox";
import Mycollection from "../components/Mycollection";
import ShelveComponent from "../components/ShelveComponent";
import ReviewerComponent from "../components/ReviewerComponent";
import FollowerComonent from "../components/FollowerComonent";
import Footer from "../components/Footer";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faGear, faCaretDown } from "@fortawesome/free-solid-svg-icons";


const Dashboard = () => {

    const {user} = useAuth()

    const [member, setMember] = useState('')
    const [showInfo, setShowInfo] = useState(false)

    //Fetch user function
    axios.defaults.withCredentials = true
    useEffect(() => {
        const fetchUserData = async () => {
            if(!user) return;

            try {
                const token = Cookies.get("token")
                const response = await axios.get("http://localhost:3001/libraryusers", {
                    headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}
                })
                
                response.data.valid ? setMember(response.data) : console.error("Invalid user data", response.data)
                
            } catch (error) {
                console.error("Error fetch user form database", error)
            }
        }
        fetchUserData()
    }, [])


    //Drop down function
    const handleShowInfo = () => {
        setShowInfo(!showInfo)
    }



    return (
        <div className={dashboardstyle.mainContainer}>
            <div className={dashboardstyle.headerContainer}>
                <div className={dashboardstyle.headerWrapper}>
                    
                    {member && member.user && member.user.profilepic ? (
                        <div className={dashboardstyle.profilePicWrapper}>
                            <img src={`http://localhost:3001/libraryusersprofilepics/${member.user.profilepic}`} alt="" style={{ borderRadius: "50%", maxWidth: "100%", maxHeight: "100%" }} />
                        </div>
                    ) : (
                        <div className={dashboardstyle.profilePicWrapper} style={{fontSize:"7rem", borderRadius:"50%", padding:"1rem", display:"flex", justifyContent:"center", alignItems:"center", backgroundColor:"#d8e2dc"}}>
                            {member && member.user && member.user.firstName && member.user.lastName ? (
                                `${member.user.firstName.charAt(0).toUpperCase()}${member.user.lastName.charAt(0).toUpperCase()}`
                            ) : (
                                'Unknown'
                            )}
                        </div>
                    )}

                    <div className={dashboardstyle.mainUsernameWrapper}>
                        <p>{member && member.user && member.user.firstName} {member && member.user && member.user.lastName}</p>
                    </div>
                </div>

                <div className={dashboardstyle.usernameAndFollowersContainer}>
                    <div className={dashboardstyle.usernameWrapper}>
                        <div className={dashboardstyle.firstNameAndLastnameWrapper}>
                            <p>{member && member.user && member.user.firstName} {member && member.user && member.user.lastName}</p>
                        </div>
                        <p>@{member && member.user && member.user.userName} - {member && member.user && member.user.reviewer === true ? (<span>Reviewer </span>) : (<span>Reader</span>)}</p>
                    </div>
                    <div className={dashboardstyle.followerAndFollowingWrapper}>
                        <div className={dashboardstyle.numberOfFollowersAndFollowing}>
                            <p>{member && member.user && member.user.followers.length }</p> 
                            <p>{member && member.user && member.user.following.length }</p> 
                        </div>
                        <div className={dashboardstyle.followersAndFollowing}>
                            <p>Followers</p>
                            <p>Following</p>
                        </div>
                    </div>
                </div>
                
            </div>

            <div className={dashboardstyle.secondMainContainerHeader}>
                <div className={dashboardstyle.secondHeaderWrapper}>
                    <h1>My Dashboard</h1>
                    <p>Welcome <span style={{backgroundColor:"#720026", borderRadius:"50%", color:"white", padding:" 0 .5rem"}}>{member && member.user && member.user.userName.charAt(0).toUpperCase()}</span> <span>{member && member.user && member.user.userName}</span> !!</p>
                </div>
                <div className={dashboardstyle.moreInfoAndEditContainer}>
                    <div className={dashboardstyle.moreInofAndDropDownWrapper}>
                        <div >
                            <p style={{cursor:"pointer"}} onClick={handleShowInfo}>More Information <span><FontAwesomeIcon icon={faCaretDown} /></span></p>
                        </div>
                        <div  className={`${dashboardstyle.moreInfoWrapper} ${showInfo ? dashboardstyle.showMoreInfoWrapper : ""}` }>
                            <p style={{fontSize:"1.5rem"}}>Frequently Asked Questions</p>
                            <ul>
                                <li>How do I renew items?</li>
                                <li>What is borrowing history?</li>
                                <li>What is Shelves for?</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className={dashboardstyle.editIconWrapper}>
                        <div className={dashboardstyle.messageWrapper}>
                            <span>{member && member.user && member.user.messages.length > 0 ? (member.user.message.length) : ""}</span>
                            <FontAwesomeIcon icon={faBell} className={`${member && member.user && member.user.length > 0 ? usernamestyle.bellIcon : "" }`} />
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faGear}/>
                        </div>
                    </div>
                </div>
            </div>

            <div className={dashboardstyle.lastSectionContainer}>
                <div className={dashboardstyle.lastSectionSideBarContainer}>
                    <Myborrowing />
                    <Myprofilebox />
                    <Mycollection />
                </div>
                <div className={dashboardstyle.shelfReviewAndIdeaContainer}>
                    <ShelveComponent />
                    <ReviewerComponent />
                    <FollowerComonent />
                </div>

            </div>

            <Footer />

        </div>
    )
}

export default Dashboard
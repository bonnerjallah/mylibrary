import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie"
import { useAuth } from "../components/AuthContext";


import { Search  } from 'lucide-react';

import poststyle from "../styles/poststyle.module.css"


const PostContainer = () => {

    const {user} = useAuth()

    const [member, setMember] = useState()
    const [allUsers, setAllUsers] = useState([])
    const [postPics, setPostPics] = useState([])

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

    console.log("member", member)

    //all users fetch
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

    console.log("allusers", allUsers)

    useEffect(() => {
        const userImage = allUsers && allUsers.filter(elem => member && member.user && member.user.following && member.user.following.includes(elem._id)).map(picElem => picElem.profilepic)

        setPostPics(userImage)
        
    }, [allUsers, member])

    const ImageSilder = ({post}) => {
        const [currentIndex, setCurrentIndex] = useState(0)

        const showPrevImage = () => {
            setCurrentIndex(index => {
                if(index === 0) return post.length -1
                return index -1 
            })
        }

        const showNextImage = () => {
            setCurrentIndex(index => {
                if(index === post.length -1) return 0
                return index + 1
            })
        }


        return (
            <div style={{border:"2px solid red", width:"100%", position:'relative'}}>
                <div style={{width:"100%", border:"2px solid blue", height:"90%", display:"flex", overflow:'hidden', columnGap:'.5rem' }}>
                    {postPics && postPics.map((pic, index) => (
                        <img key={index} src={`http://localhost:3001/libraryusersprofilepics/${pic}`} alt={`Post ${index + 1}`} width="40%rem" height="100%"  />
                    ))}
                </div>
            </div>
        )

    }

    console.log("Post Pics", postPics)

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
                    {/* {allUsers && member && member.user && member.user.following && (
                        <>
                            {allUsers.filter(elem => member.user.following.includes(elem._id)).map((filterElem, index) => (
                                <div key={index} className={poststyle.followingWrapper}>
                                    <img src={`http://localhost:3001/libraryusersprofilepics/${filterElem.profilepic}`} width="100%" height="100%"  />
                                </div>
                            ))}
                        </>
                    )} */}

                    <ImageSilder posts={postPics} />
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
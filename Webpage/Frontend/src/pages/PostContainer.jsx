import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie"
import { useAuth } from "../components/AuthContext";


import { Search, ArrowBigLeft, ArrowBigRight, Heart, ImagePlus, Plus } from 'lucide-react';

import poststyle from "../styles/poststyle.module.css"


const PostContainer = () => {

    const {user} = useAuth()

    const [member, setMember] = useState()
    const [allUsers, setAllUsers] = useState([])
    const [postPics, setPostPics] = useState([])
    const [followingUserName, setFollowingUserName] = useState()

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
        const userImage = allUsers && allUsers.filter(elem => member && member.user && member.user.following && member.user.following.includes(elem._id)).map(picElem => picElem)



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
            <div style={{ width:"100%", position:'relative'}}>
                <div className={poststyle.postImageWrapper  }>
                    {postPics && postPics.map((pic, index) => (
                        <div key={index} style={{height:"100%", border:"1px solid black", translate: `${-100 * currentIndex}%`}} className={poststyle.followingHomePageImage}>
                            <img  src={`http://localhost:3001/libraryusersprofilepics/${pic.profilepic}`} alt={`Post ${index + 1}`}  width="100%" height="100%" style={{borderRadius:"1rem"}}/>
                            <div className={poststyle.usernameWrapper}>
                                <p>@ {pic.username}</p> 
                            </div>
                        </div>
                    ))}

                    
                    
                </div>
                    <ArrowBigLeft size="40" className={poststyle.scrollIconLeft} onClick={showPrevImage} />
                    <ArrowBigRight size="40" className={poststyle.scrollIconRight} onClick={showNextImage} />
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
                    <ImageSilder post={postPics} />
                </div>
                <div className={poststyle.postWrapper}>
                    <div className={poststyle.postFormWrapper}>
                        <form>
                            <div className={poststyle.inputWrapper}>
                                {member && member.user && member.user.profilepic && (
                                    <div>
                                        <img src={`http://localhost:3001/libraryusersprofilepics/${member.user.profilepic}`} width="50" height="50" style={{borderRadius:"50%"}}/>
                                    </div>
                                )}
                                <label htmlFor="whatYouPosted"></label>
                                <input type="text" name="whatposted" id="WhatYouPosted" placeholder="whats on your mind?"  />
                            </div>
                            <div className={poststyle.addImageButton}>
                                <label htmlFor="ImagePost">
                                    <ImagePlus /> Add Image
                                </label>
                                <input type="file" name="imagePost" id="ImagePost" accept="image/*" style={{display:"none"}}   />
                                <button className={poststyle.postBttn}> <Plus /> Add Post</button>
                            </div>
                            
                        </form>
                    </div>
                    <div className={poststyle.postItSelf}>
                        post goes here
                    </div>
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
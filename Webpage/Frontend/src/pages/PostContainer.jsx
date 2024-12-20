import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie"
import { useAuth } from "../components/AuthContext";


import { Search, ArrowBigLeft, ArrowBigRight, Heart, ImagePlus, Plus, MessageCircleOff } from 'lucide-react';

import poststyle from "../styles/poststyle.module.css"

import Postsbox from "../components/Postsbox";

const backEndUrl = import.meta.env.VITE_BACKEND_URL


const PostContainer = () => {

    const {user} = useAuth()

    const [member, setMember] = useState()
    const [allUsers, setAllUsers] = useState([])
    const [postPics, setPostPics] = useState([])
    const [followingUserName, setFollowingUserName] = useState()
    const [postInputData, setPostInputData] = useState({
        whatposted : ""
    })
    const [imagePosting, setImagePosting] = useState("")

    //user fetch data
    axios.defaults.withCredentials = true
    useEffect(() => {
        if(!user)return
        const fetchUserData = async () => {
            try {
                const token = Cookies.get("token")
                const response = await axios.get(`${backEndUrl}/libraryusers`, {
                    headers:{"Content-Type": "application/json", "Authorization": `Bearer ${token}`}
                })

                response.data.valid ? setMember(response.data) : console.error("error fetching user form database", response.data)
                
            } catch (error) {
                console.error("error fetching user data", error)
            }
        }
        fetchUserData()
    }, [])


    //all users fetch
    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const response = await axios.get(`${backEndUrl}/usersToFollow`)
                setAllUsers(response.data)
                
            } catch (error) {
                console.log("error fetching all users", error)
            }
        }
        fetchAllUsers()
    }, [])


    useEffect(() => {
        // const userImage = allUsers && allUsers.filter(elem => member && member.user && member.user.following && member.user.following.includes(elem._id)).map(picElem => picElem)

        const postImage = allUsers && allUsers.length > 0 && allUsers.filter(user => {
            return user.posts && user.posts.length > 0
        })

        setPostPics(postImage)
        
    }, [allUsers, member])

    
    //Image slider function
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
                    {postPics && postPics.map((userPost, index) => (
                        userPost.posts.length > 0 && (
                            <div key={index} style={{height:"100%", border:"1px solid black", translate:`${-100 * currentIndex}%`}} className={poststyle.followingHomePageImage}>
                                <div className={poststyle.postProfilePicWrapper}>
                                    <img src={`${backEndUrl}/libraryusersprofilepics/${userPost.profilepic}`} alt="" width="50" height="50" style={{borderRadius:"50%"}} />
                                </div>
                                <img src={`${backEndUrl}/postpictures/${userPost.posts[userPost.posts.length - 1].postpic}`} alt={`Post ${index + 1}`}  width="100%" height="100%" style={{borderRadius:"1rem"}} />
                                <div className={poststyle.usernameWrapper}>
                                    <p>@ {userPost.username}</p>
                                </div>
                            </div>
                        )
                    ))}

                    
                    
                </div>
                    <ArrowBigLeft size="40" className={poststyle.scrollIconLeft} onClick={showPrevImage} />
                    <ArrowBigRight size="40" className={poststyle.scrollIconRight} onClick={showNextImage} />
            </div>
        )

    }


    //function to handle post images
    const handlePostImage = (e) => {
        setImagePosting(e.target.files[0])
    }

    // binding form input
    const handlePostInputData = (e) => {
        const {name, value} = e.target
        setPostInputData((prev) => ({...prev, [name]: value}))
    }

    //Post data submiting function
    const handleSubmitData = async (e) => {
        e.preventDefault()

        const userId = member.user.id

        const formData = new FormData()
        
        formData.append("userId", userId)
        formData.append("whatposted", postInputData.whatposted )

        if(imagePosting) {
            formData.append("imagePost", imagePosting, imagePosting.name)
        }

        try {
            const response = await axios.post(`${backEndUrl}/posting`, formData, {
                headers: {"Content-Type": "multipart/form-data"}
            })

            if(response.status === 200) {
                setPostInputData({
                    whatposted : ""
                })
            }

           
        } catch (error) {
            console.log("Error posting", error)
        }
    }



    return (
        <div className={poststyle.postMainContainer}>
            <div className={poststyle.postSideContainer}>
                <div>
                    {member && member.user && member.user.profilepic && member.user.userName && (
                        <div style={{display:"flex", alignItems:"center", columnGap:"1rem"}}>
                            <img src={`${backEndUrl}/libraryusersprofilepics/${member.user.profilepic}`} alt=""  width="35" height="35" style={{borderRadius:"50%"}} />
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
                        <form onSubmit={handleSubmitData} encType="form-data" method="POST">
                            <div className={poststyle.inputWrapper}>
                                {member && member.user && member.user.profilepic && (
                                    <div>
                                        <img src={`${backEndUrl}/libraryusersprofilepics/${member.user.profilepic}`} width="50" height="50" style={{borderRadius:"50%"}}/>
                                    </div>
                                )}
                                <label htmlFor="whatYouPosted"></label>
                                <input type="text" name="whatposted" id="whatYouPosted" placeholder="whats on your mind?" value={postInputData.whatposted} onChange={handlePostInputData}  />
                            </div>
                            <div className={poststyle.addImageButton}>
                                <label htmlFor="ImagePost">
                                    <ImagePlus /> Add Image
                                </label>
                                <input type="file" name="imagePost" id="ImagePost" accept="image/*" style={{display:"none"}} onChange={handlePostImage}   />
                                <button type="submit" className={poststyle.postBttn}> <Plus /> Add Post</button>
                                <button className={poststyle.canscelPostBttn}> <MessageCircleOff /> Cancle Post</button>
                            </div>
                        </form>
                    </div>
                    <div className={poststyle.postItSelf}>
                        <Postsbox />
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
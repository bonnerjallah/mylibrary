import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from "js-cookie"
import { useAuth } from './AuthContext';

import { Menu, ThumbsUp, Heart, Laugh, Frown, MessageCircle } from 'lucide-react';
import postboxstyle from "../styles/postboxstyle.module.css"


const Postsbox = () => {

    const {user} = useAuth()

    const [member, setMember] = useState("")
    const [allUsers, setAllUsers] = useState([])
    const [showLikeOptions, setShowLikeOptions] = useState(false)
    const [showCommentInput, setShowCommentInput] = useState(false)
    const [like, setLike] = useState("")
    const [heart, setHeart] = useState("")
    const [laugh, setLaugh] = useState("")
    const [sad, setSad] = useState("")

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

    // console.log("User data", member)

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

    // console.log("all users", allUsers)

    const handleShowLikeOptions = () => {
        setShowLikeOptions(!showLikeOptions)
    }

    const handleshowCommentInput = () => {
        setShowCommentInput(!showCommentInput)
    }

    const handleCloseInputComment = () => {
        setShowCommentInput(false)
    }



    const handleLikeOption = async (e, postsid, userid) => {
        e.preventDefault()
        setLike("Like")
        setHeart("")
        setLaugh("")
        setSad("")

        const requestdata = {
            userId : member.user.id,
            like : "Like",
            postId : postsid,
            posterId: userid
        }

        try {
            const response = await axios.put("http://localhost:3001/postoptions", requestdata, {
                headers: {"Content-Type": "application/json"}
            })

            if(response.status === 200) {
                console.log("Successfully like post")
            }
            
        } catch (error) {
            console.log("error inserting likes", error)
        }

    }


    const handleHeartOption =  async (e, postsid, userid) => {
        e.preventDefault()
        setHeart("Heart")
        setLike("")
        setLaugh("")
        setSad("")

        const requestdata = {
            userId : member.user.id,
            heart : "Heart",
            postId : postsid,
            posterId: userid
        }

        try {
            const response = await axios.put("http://localhost:3001/postoptions", requestdata, {
                headers: {"Content-Type": "application/json"}
            })

            if(response.status === 200) {
                console.log("Successfully like post")
            }
            
        } catch (error) {
            console.log("error inserting likes", error)
        }

    }

    const handleLaughOption = (e) => {
        e.preventDefault()
        setLaugh("Laugh")
        setLike("")
        setHeart("")
        setSad("")
    }

    const handleSadOption = (e) => {
        e.preventDefault()
        setSad("Sad")
        setLike("")
        setLaugh("")
        setHeart("")
    }

    const handeCommentAndLikeInputData =  async (e, reaction) => {
        e.preventDefault()

        const userId = member.user.id

        console.log(reaction)
        
    }

    return (
        <div >
            {allUsers && allUsers.map((user, id) => (
                user.posts.length > 0 && (
                    <div key={id} className={postboxstyle.mainContainer}>
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
                                <form onSubmit={(e) => handeCommentAndLikeInputData(e, reaction)} encType='form-data' method='POST'>
                                    <div className={postboxstyle.likesCount}>
                                        likes count
                                    </div>
                                    <div className={postboxstyle.commentLeaverContainer}>
                                        <div className={ showLikeOptions ? postboxstyle.showClickWrapper : postboxstyle.clikesWrapper } >
                                            
                                            <button onClick={(e) => {handleLikeOption(e, user.posts[user.posts.length - 1]._id, user._id)}}>
                                                <ThumbsUp className={postboxstyle.likebutton} />
                                            </button>
                                            <button onClick={(e) => {handleHeartOption(e, user.posts[user.posts.length - 1]._id, user._id)}}>
                                                <Heart className={postboxstyle.heartIconButton} />
                                            </button>
                                            <button onClick={(e) => {handleLaughOption(e, user.posts[user.posts.length - 1]._id, user._id)}}>
                                                <Laugh className={postboxstyle.laughIconButton} />
                                            </button>
                                            <button onClick={(e) => {handleSadOption(e, user.posts[user.posts.length - 1]._id, user._id)}}>
                                                <Frown className={postboxstyle.sadIconButton} />
                                            </button>
                                        </div>
                                        <div style={{display:"flex", justifyContent:"space-around", width:"100%"}}>
                                            <p><ThumbsUp style={{cursor:"pointer", marginRight:".5rem"}}  onMouseEnter={handleShowLikeOptions} /> Like</p>
                                            <p><MessageCircle style={{cursor:"pointer", marginRight:".5rem"}} onClick={handleshowCommentInput}  /> Comment</p>
                                        </div>
                                        <div className={ showCommentInput ? postboxstyle.commentInputWrapper : postboxstyle.commentInputNoShow}>
                                            <span onClick={handleCloseInputComment}>X</span>
                                            <label htmlFor="Comment"  >
                                                <input type="text" name='comment' id='Comment' placeholder='Write a comment' />
                                            </label>
                                            <button type='submit'>Submit</button>
                                        </div>

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
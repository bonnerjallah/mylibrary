import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from "js-cookie"
import { useAuth } from './AuthContext';

import { Menu, ThumbsUp, Heart, Laugh, Frown, MessageCircle, MessageCircleMore } from 'lucide-react';
import postboxstyle from "../styles/postboxstyle.module.css"

const backEndUrl = import.meta.env.VITE_BACKEND_URL


const Postsbox = () => {

    const {user} = useAuth()

    const [member, setMember] = useState("")
    const [allUsers, setAllUsers] = useState([])
    const [showLikeOptions, setShowLikeOptions] = useState(false)
    const [showCommentInput, setShowCommentInput] = useState(false)
    const [comment, setComment] = useState({
        comment: ""
    })
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

    // console.log("User data", member)

    //fetching all users
    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const response = await axios.get(`${backEndUrl}/usersToFollow`)
                setAllUsers(response.data)
            } catch (error) {
                console.log("Error fetch all user", error)
            }
        }
        fetchAllUsers()
    }, [])


    const handleShowLikeOptions = () => {
        setShowLikeOptions(!showLikeOptions)
    }

    const handleshowCommentInput = () => {
        setShowCommentInput(!showCommentInput)
    }

    const handleCloseInputComment = () => {
        setShowCommentInput(false)
    }


    //like functions
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
            const response = await axios.put(`${backEndUrl}/postoptions`, requestdata, {
                headers: {"Content-Type": "application/json"}
            })

            if(response.status === 200) {
                // console.log("Successfully like post")
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
            const response = await axios.put(`${backEndUrl}/postoptions`, requestdata, {
                headers: {"Content-Type": "application/json"}
            })

            if(response.status === 200) {
                // console.log("Successfully like post")
            }
            
        } catch (error) {
            console.log("error inserting likes", error)
        }

    }

    const handleLaughOption = async (e, postsid, userid) => {
        e.preventDefault()
        setLaugh("Laugh")
        setLike("")
        setHeart("")
        setSad("")

        const requestdata = {
            userId : member.user.id,
            laugh : "laugh",
            postId : postsid,
            posterId: userid
        }

        try {
            const response = await axios.put(`${backEndUrl}/postoptions`, requestdata, {
                headers: {"Content-Type": "application/json"}
            })

            if(response.status === 200) {
                // console.log("Successfully like post")
            }
            
        } catch (error) {
            console.log("error inserting likes", error)
        }
    }

    const handleSadOption = async (e, postsid, userid) => {
        e.preventDefault()
        setSad("Sad")
        setLike("")
        setLaugh("")
        setHeart("")

        const requestdata = {
            userId : member.user.id,
            sad: "Sad",
            postId : postsid,
            posterId: userid
        }

        try {
            const response = await axios.put(`${backEndUrl}/postoptions`, requestdata, {
                headers: {"Content-Type": "application/json"}
            })

            if(response.status === 200) {
                // console.log("Successfully like post")
            }
            
        } catch (error) {
            console.log("error inserting likes", error)
        }
    }


    //Input field function
    const handleCommentInput = (e) => {
        const {name, value} = e.target
        setComment((prev) => ({...prev, [name]: value}))
    }

    //Submit Comment
    const handeCommentInputDataSubmit =  async (e, postsid, userid) => {
        e.preventDefault()

        const requestData = {
            userId : member.user.id,
            postId : postsid,
            posterId : userid,
            comment : comment.comment
        }

        console.log(requestData)

        try {
            const response = await axios.put(`${backEndUrl}/postoptions`, requestData, {
                headers:{"Content-Type": "application/json"}
            })

            if(response.status === 200) {
                
                setComment({
                    comment: ""
                })            
            }
            
            

            setTimeout(() => {
                handleCloseInputComment()
            }, 2000);

        } catch (error) {
            console.log("Error inserting comment", error)
        }
    }

    return (
        <div >
            {allUsers && allUsers.map((user, id) => (
                user.posts.length > 0 && (
                    <div key={id} className={postboxstyle.mainContainer}>
                        <div className={postboxstyle.headerContainer}>
                            <div className={postboxstyle.postImageAndContainer}>
                                <div className={postboxstyle.posterImageWrapper}>
                                    <img src={`${backEndUrl}/libraryusersprofilepics/${user.profilepic}`} width="50" height="50" style={{borderRadius:"50%"}} />
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
                            <img src={`${backEndUrl}/postpictures/${user.posts[user.posts.length - 1].postpic}`}         className={postboxstyle.WhatsPostedImage} />
                        </div>

                        <div className={postboxstyle.commentFormWrapper}>
                            {member && member.user && member.user.profilepic && (
                                <>
                                    <div className={postboxstyle.likesCount}>
                                        {user && user.posts && user.posts[user.posts.length - 1].postreactions && (
                                            <div className={postboxstyle.likeContainer}>
                                                <div className={postboxstyle.likes}>
                                                    {Object.keys(user.posts[user.posts.length - 1].postreactions).map(key => {
                                                        if (key !== "") {
                                                            if (key === "cryby" && user.posts[user.posts.length - 1].postreactions[key].length > 0) {
                                                                return <Frown fill='orange' key={key} />;
                                                            } else if (key === "laughby" && user.posts[user.posts.length - 1].postreactions[key].length > 0) {
                                                                return <Laugh fill='yellow'  key={key} />;
                                                            } else if (key === "likeby" && user.posts[user.posts.length - 1].postreactions[key].length > 0) {
                                                                return <ThumbsUp fill='blue' stroke='none' key={key} />;
                                                            } else if (key === "loveby" && user.posts[user.posts.length - 1].postreactions[key].length > 0) {
                                                                return <Heart fill='red' stroke='none' key={key} />;
                                                            }
                                                        }
                                                        return null; // Render nothing if condition is not met
                                                    })}
                                                </div>
                                                <span>
                                                    {Object.values(user.posts[user.posts.length - 1].postreactions).reduce((acc, curr) => acc + curr.length, 0) > 0 
                                                        ? Object.values(user.posts[user.posts.length - 1].postreactions).reduce((acc, curr) => acc + curr.length, 0)
                                                        : ""}
                                                </span>

                                            </div>
                                        )}

                                        <div >
                                            {user && user.posts && user.posts[user.posts.length - 1].postcomments && user.posts[user.posts.length - 1].postcomments.length > 0 && (
                                                <div className={postboxstyle.commentCount}>
                                                    <MessageCircleMore  />
                                                    {user.posts[user.posts.length - 1].postcomments.length}
                                                </div>
                                            )}
                                        </div>

                                    </div>
                                    <div className={postboxstyle.commentLeaverContainer}>
                                        <div className={ showLikeOptions ? postboxstyle.showClickWrapper : postboxstyle.clikesWrapper } >
                                            
                                            <button onClick={(e) => {handleLikeOption(e, user.posts[user.posts.length - 1]._id, user._id)}}>
                                                <ThumbsUp className={ postboxstyle.likebutton } />
                                            </button>
                                            <button onClick={(e) => {handleHeartOption(e, user.posts[user.posts.length - 1]._id, user._id)}}>
                                                <Heart className={ postboxstyle.heartIconButton } />
                                            </button>
                                            <button onClick={(e) =>  {handleLaughOption(e, user.posts[user.posts.length - 1]._id, user._id)}}>
                                                <Laugh className={ postboxstyle.laughIconButton } />
                                            </button>
                                            <button onClick={(e) => {handleSadOption(e, user.posts[user.posts.length - 1]._id, user._id)}}>
                                                <Frown className={postboxstyle.sadIconButton} />
                                            </button>
                                        </div>
                                        <div style={{display:"flex", justifyContent:"space-around", width:"100%"}}>
                                            <p><ThumbsUp style={{cursor:"pointer", marginRight:".5rem"}}  onMouseEnter={handleShowLikeOptions} /> Like</p>
                                            <p><MessageCircle style={{cursor:"pointer", marginRight:".5rem"}} onClick={handleshowCommentInput}  /> Comment</p>
                                        </div>

                                        <form onSubmit={(e) => handeCommentInputDataSubmit(e, user.posts[user.posts.length - 1]._id, user._id)} encType='form-data' method='PUT'>
                                            <div className={ showCommentInput ? postboxstyle.commentInputWrapper : postboxstyle.commentInputNoShow}>
                                                <span onClick={handleCloseInputComment}>X</span>
                                                <label htmlFor="Comment"  >
                                                    <input type="text" name='comment' id='Comment' placeholder='Write a comment' value={comment.comment} onChange={handleCommentInput} />
                                                </label>
                                                <button type='submit'>Submit</button>
                                            </div>
                                        </form>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className={postboxstyle.commentsContainer}>
                        {user && user.posts && user.posts[user.posts.length - 1].postcomments && (
                            <div className={postboxstyle.commentsWrapper}>
                                {user.posts[user.posts.length - 1].postcomments.map((elem, index) => {
                                    const commenter = allUsers && allUsers.find(userElem => userElem.id === elem.commenter.toLowerCase());
                                    return (
                                        <div key={index}>
                                            <span>{elem.comment}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        </div>

                    </div>
                )
            ))}
        </div>
    )
}

export default Postsbox
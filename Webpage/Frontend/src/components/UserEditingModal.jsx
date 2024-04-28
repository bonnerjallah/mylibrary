import { useState, useEffect } from "react"
import axios from 'axios'
import Cookies from "js-cookie"
import { useAuth } from "./AuthContext"

import { Camera } from 'lucide-react';
import usereditingmodalstyle from "../styles/usereditingmodalstyle.module.css"


const userEditingModal = ({closeModal}) => {

    const {user} = useAuth()

    const [member, setMember] = useState()
    const [profilePicUrl, setProfilePicUrl] = useState("")
    const [eidtInputData, setEditinputData] = useState({
        username: "",
        email: "",
        newpwd: "",
        address: "",
        city: "",
        state: "",
        postolcode: ""

    })
    const [successfullyUdatedInfo, setSuccessfullyUdatedInfo] = useState("")

    //Fetching user data
    axios.defaults.withCredentials = true
    useEffect(() => {
        if(!user) return
        const fetchUserData = async () => {
            try {
                const token = Cookies.get("token")
                const response = await axios.get("http://localhost:3001/libraryusers", {
                    headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}
                })

                response.data.valid ? setMember(response.data) : console.error("error fetchind user form database", response.data)
                
            } catch (error) {
                console.log("error fetching userdata", error)
            }
        }
        fetchUserData()
    }, [])


    // edit user porfile pic function
    const handleProfilePic = (e) => {
        setProfilePicUrl(e.target.files[0])
    }

    //handle user edited input function
    const handleEditedInputData = (e) => {
        const {name, value} = e.target
        setEditinputData((prev) => ({...prev, [name]: value }))
    }

    //submit inputdata function
    const handleEditInputSubmit = async (e) => {
        e.preventDefault()

        const userId = member.user.id

        const formdata = new FormData()

        formdata.append("userId", userId)
        formdata.append("username", eidtInputData.username)
        formdata.append("email", eidtInputData.email)
        formdata.append("newpwd", eidtInputData.newpwd)
        formdata.append("address", eidtInputData.address)
        formdata.append("city", eidtInputData.city)
        formdata.append("state", eidtInputData.state)
        formdata.append("postolcode", eidtInputData.postolcode)

        if(profilePicUrl) {
            formdata.append("profilepic", profilePicUrl, profilePicUrl.name )
        }


        try {
            const response = await axios.put("http://localhost:3001/edituserdata", formdata, {
                headers:{"Content-Type": "multipart/form-data"}
            })

            if(response.status === 200) {
                console.log("successfully inserted edited data")

                setSuccessfullyUdatedInfo("Successfull updated your Information")

                setTimeout(() => {
                    setSuccessfullyUdatedInfo('')
                    closeModal(false)
                }, 2000);
            }

            setEditinputData({
                username: "",
                email: "",
                newpwd: "",
                address: "",
                city: "",
                state: "",
                postolcode: ""
            })

            
        } catch (error) {
            console.log("error inserting data", error)
        }
    }



    return (
        <div className={usereditingmodalstyle.mainContainer} >
            <h1>Edit Profile</h1>
            <p onClick={() => {closeModal(false)}}>Close</p>
            
            
                {member && member.user && (
                    
                    <form onSubmit={handleEditInputSubmit} encType="mulitpart/form-data" method="PUT">
                        <div className={usereditingmodalstyle.porfilePicWrapper}>
                            {member && member.user && member.user.profilepic ? (
                                <img src={`http://localhost:3001/libraryusersprofilepics/${member.user.profilepic}`} width="200" height="200" style={{borderRadius:"50%"}}/>
                            ): ( 
                                <div  style={{fontSize:"7rem", borderRadius:"50%", padding:"1rem", display:"flex", justifyContent:"center", alignItems:"center", backgroundColor:"#d8e2dc"}}>
                                    {member && member.user && member.user.firstName && member.user.lastName ? (
                                        `${member.user.firstName.charAt(0).toUpperCase()}${member.user.lastName.charAt(0).toUpperCase()}`
                                    ) : (
                                        'Unknown'
                                    )}
                                </div>
                            )}
                            
                            <label htmlFor="ProfilePic">
                                <input type="file" name="profilepic" id="ProfilePic" accept="image/*" style={{display:"none"}} onChange={handleProfilePic} />
                                <Camera /> Edit
                            </label>
                        </div>

                        <div className={usereditingmodalstyle.inputDataWrapper}>
                            <label htmlFor="UserName">
                                User Name:
                                <input type="text" name="username" id="UserName" value={eidtInputData.username} placeholder="UserName" onChange={handleEditedInputData}/>
                            </label>

                            <label htmlFor="Email">
                                Email: 
                                <input type="text" name="email" id="Email" value={eidtInputData.email} placeholder="Email" onChange={handleEditedInputData} />
                            </label>

                            <label htmlFor="NewPassWord">
                                Password:
                                <input type="password" name="newpwd" id="NewPassWord" value={eidtInputData.newpwd} placeholder="Password" onChange={handleEditedInputData} />
                            </label>

                            <label htmlFor="Address">
                                Address: 
                                <input type="text" name="address" id="Address" value={eidtInputData.address} placeholder="111 Main St" onChange={handleEditedInputData} />
                            </label>

                            <label htmlFor="City">
                                City: 
                                <input type="text" name="city" id="City" value={eidtInputData.city} placeholder="City" onChange={handleEditedInputData} />
                            </label>

                            <label htmlFor="State">
                                State: 
                                <input type="text" name="state" id="State" value={eidtInputData.state} placeholder="ST" onChange={handleEditedInputData} />
                            </label>

                            <label htmlFor="PostalCode">
                                Zip Code:
                                <input type="number" name="postolcode" id="PostalCode" value={eidtInputData.postolcode} placeholder="11111" onChange={handleEditedInputData} />
                            </label>
                        </div>

                        <div className={usereditingmodalstyle.submitButtonWrapper}>
                            <button type="submit">Submit</button>
                        </div>
                    </form>
                    
                    
                    
                )}

            {successfullyUdatedInfo && (<p className={usereditingmodalstyle.successMsg}>{successfullyUdatedInfo}</p>)}
        </div>
    )
}

export default userEditingModal


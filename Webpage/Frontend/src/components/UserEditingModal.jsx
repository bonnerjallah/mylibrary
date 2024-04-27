import { useState, useEffect } from "react"
import axios from 'axios'
import Cookies from "js-cookie"
import { useAuth } from "./AuthContext"

import { Camera } from 'lucide-react';
import usereditingmodalstyle from "../styles/usereditingmodalstyle.module.css"


const userEditingModal = ({closeModal}) => {

    const {user} = useAuth()

    const [member, setMember] = useState()
    const [profilePic, setProfilePic] = useState()
    const [eidtInputData, setEditinputData] = useState({
        username: "",
        email: "",
        newpwd: "",
        address: "",
        city: "",
        state: "",
        postolcode: ""

    })

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
        setProfilePic(e.target.files[0])
    }

    //handle user edited input function
    const handleEditedInputData = (e) => {
        const {name, value} = e.target
        setEditinputData((prev) => ({...prev, [name]: value }))
    }



    return (
        <div className={usereditingmodalstyle.mainContainer} >
            <h1>Edit Profile</h1>
            <p onClick={() => {closeModal(false)}}>Close</p>
            
            
                {member && member.user && (
                    
                    <form onSubmit={handleEditInputSubmit} encType="form-data" method="POST">
                        <div className={usereditingmodalstyle.porfilePicWrapper}>
                            <img src={`http://localhost:3001/libraryusersprofilepics/${member.user.profilepic}`} width="200" height="200" style={{borderRadius:"50%"}}/>
                            
                            <label htmlFor="ProfilePic">
                                <input type="file" name="profilepic" id="ProfilePic" style={{display:"none"}} onChange={handleProfilePic} />
                                <Camera /> Edit
                            </label>
                        </div>
                        <div className={usereditingmodalstyle.inputDataWrapper}>
                            <label htmlFor="UserName">
                                User Name:
                                <input type="text" name="username" id="UserName" value={member.user.userName} onChange={handleEditedInputData}/>
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

                
            

        </div>
    )
}

export default userEditingModal


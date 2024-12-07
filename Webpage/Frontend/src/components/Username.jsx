import {useEffect, useState} from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";
import Cookies from "js-cookie";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

import usernamestyle from "../styles/usernamestyle.module.css"

const backEndUrl = import.meta.env.VITE_BACKEND_URL


const Username = () => {

    const { user } = useAuth();

    const [member, setMember] = useState('');

    axios.defaults.withCredentials = true;

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) return;
    
            try {
                const token = Cookies.get("token");
                const response = await axios.get(`${backEndUrl}/libraryusers`, {
                    headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}
                });
    
                response.data.valid ? setMember(response.data) : console.error("Invalid response data", response.data);
            } catch (error) {
                console.error("Error fetching user data", error);
            }
        };
    
        fetchUserData(); 
    }, [user]);
    

    return (
        <>
            <div className={usernamestyle.mainContainer} >
                <div className={usernamestyle.firstletter}>
                    {member && (<p>{member.user.userName.charAt(0).toUpperCase()}</p>)}
                </div>
                <h4>
                    {member && (<p>{member.user.userName}</p>)}
                </h4>
                <div>
                    <FontAwesomeIcon icon={faCaretDown} />
                </div>
            </div>

        </>
        
    )
}

export default Username
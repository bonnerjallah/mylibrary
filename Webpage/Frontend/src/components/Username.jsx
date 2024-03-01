import {useEffect, useState} from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCaretDown } from "@fortawesome/free-solid-svg-icons";

import usernamestyle from "../styles/usernamestyle.module.css"

const Username = () => {

    const {user} = useAuth()

    const [member, setMember] = useState('')



    
    
    return (
        <>
            <div className={usernamestyle.mainContainer} >
                <div className={usernamestyle.firstletter}>
                    B
                </div>
                <h4>
                    UserName Goes here
                </h4>
                <div>
                    <FontAwesomeIcon icon={faCaretDown} />
                </div>
            </div>

        </>
        
    )
}

export default Username
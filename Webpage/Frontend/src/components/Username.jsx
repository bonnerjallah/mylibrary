import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCaretDown } from "@fortawesome/free-solid-svg-icons";

import usernamestyle from "../styles/usernamestyle.module.css"


const Username = () => {
    return (
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
    )
}

export default Username
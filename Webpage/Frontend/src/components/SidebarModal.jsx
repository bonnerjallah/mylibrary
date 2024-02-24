import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

import sidebarModalstyle from "../styles/sidebarModalstyle.module.css"
import { NavLink } from 'react-router-dom';

const SidebarModal = ({closeSidebarModal}) => {

    const [isCultureVisible, setCultureVisible] = useState(false);

    const handleShowCulture = () => {
        console.log("button click")
        setCultureVisible(!isCultureVisible);
    }

    const [isLifeStyleVisible, setIsLifeStyleVisible] = useState(false)

    const handleShowLifestyleDiv = () => {
        setIsLifeStyleVisible(!isLifeStyleVisible)
    }


    return (
        <div className={sidebarModalstyle.mainContainer}>
            <div className={sidebarModalstyle.closeModalBttn} onClick={() => closeSidebarModal(false)}><p>X</p></div>
            <div className={sidebarModalstyle.listItems}>
                <ul>
                    <li><NavLink>Articles</NavLink></li>
                    <li><NavLink>Events</NavLink></li>
                    <li>
                        <NavLink onClick={handleShowCulture}>Culture <FontAwesomeIcon icon={faCaretDown} /> </NavLink>
                        <div className={`${sidebarModalstyle.culture} ${isCultureVisible ? sidebarModalstyle.showVisible : ""}`}>
                            <ul>
                                <li><NavLink>Documentry</NavLink></li>
                                <li><NavLink>Music</NavLink></li>
                            </ul>
                        </div>
                    </li>
                    <li><NavLink>Work & Money</NavLink></li>
                    <li>
                        <NavLink onClick={handleShowLifestyleDiv}>Life style  <FontAwesomeIcon icon={faCaretDown} /></NavLink>
                        <div className={`${sidebarModalstyle.lifeStyle} ${isLifeStyleVisible ? sidebarModalstyle.showLifeStyle : ""}`}>
                            <ul>
                                <li><NavLink>Food</NavLink></li>
                                <li><NavLink>Travel</NavLink></li>
                                <li><NavLink>Health</NavLink></li>
                            </ul>
                        </div>
                    </li>
                    <li><NavLink>Science & Technology</NavLink></li>
                </ul>
            </div>
        </div>
    )
}

export default SidebarModal
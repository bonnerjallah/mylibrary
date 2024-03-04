import dashboardstyle from "../styles/dashboardstyle.module.css"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faGear, faCaretDown } from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
    return (
        <div className={dashboardstyle.mainContainer}>
            <div className={dashboardstyle.headerContainer}>
                <div className={dashboardstyle.headerWrapper}>
                    <div className={dashboardstyle.profilePicWrapper}>
                        <img src="" alt="" />
                    </div>
                    <div className={dashboardstyle.MainUsernameWrapper}>
                        <p>User Name</p>
                    </div>
                </div>
                <div className={dashboardstyle.usernameAndFollowersContainer}>
                    <div className={dashboardstyle.usernameWrapper}>
                        <div className={dashboardstyle.firstNameAndLastnameWrapper}>
                            <p>first name</p> <p>LastName</p>
                        </div>
                        <p>user name</p>
                    </div>
                    <div className={dashboardstyle.followerAndFollowingWrapper}>
                        <div className={dashboardstyle.numberOfFollowersAndFollowing}>
                            <p>0</p>
                            <p>0</p>
                        </div>
                        <div className={dashboardstyle.followersAndFollowing}>
                            <p>Followers</p>
                            <p>Following</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className={dashboardstyle.secondMainContainerHeader}>
                <div className={dashboardstyle.secondHeaderWrapper}>
                    <h1>My Dashboard</h1>
                    <p>Welcome <span>B</span> <span>Username</span> !!</p>
                </div>
                <div className={dashboardstyle.moreInfoAndEditContainer}>
                    <div className={dashboardstyle.moreInfoWrapper}>
                        <p>More Information <span><FontAwesomeIcon icon={faCaretDown} />  </span></p>
                        <ul>
                            <li>How do I renew items?</li>
                            <li>What is borrowing history?</li>
                            <li>What is Shelves for?</li>
                        </ul>
                    </div>
                    <div className={dashboardstyle.editIconWrapper}>
                        <div>
                            <FontAwesomeIcon icon={faBell}  />
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faGear}/>
                        </div>
                    </div>
                </div>
            </div>

            <div className={dashboardstyle.lastSectionContainer}>
                <div className={dashboardstyle.lastSectionSideBarContainer}>

                </div>
                <div className={dashboardstyle.shelfReviewAndIdeaContainer}>

                </div>

            </div>

        </div>
    )
}

export default Dashboard
import { ArrowLeft, LibraryBig } from "lucide-react"

import shelfstyle from "../styles/shelfstyle.module.css"

const Shelf = () => {
    return (
        <>
            <div className={shelfstyle.userNameContainer}>
                <div className={shelfstyle.usernameWrapper}>
                    <p>B</p>
                    <h2>Username</h2>
                </div>
                <p>Consious Library</p>
            </div>
            <div className={shelfstyle.secondHeaderContainer}>
                <ArrowLeft />
                <div className={shelfstyle.shelvesWrapper}>
                    <LibraryBig /> 
                    <h2>My Shelves</h2> 
                    <div className={shelfstyle.completedInProgressForLaterWrapper}>
                        <p>Completed (0)</p>
                        <p>In Progress (0)</p>
                        <p>For Later (0)</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Shelf
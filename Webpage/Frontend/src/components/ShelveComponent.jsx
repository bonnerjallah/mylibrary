import {NavLink} from "react-router-dom"
import { LibraryBig, ArrowRight } from 'lucide-react';


import shelvestyle from "../styles/shelvestyle.module.css"

const ShelveComponent = () => {
    return (
        <div className={shelvestyle.componentMainContainer}>
            <div className={shelvestyle.emptyShelfWrapper}>
                <div className={shelvestyle.componentHeader}>
                    <h2>Get Started</h2>
                </div>
                <div className={shelvestyle.middleWrapper}>
                    <p><LibraryBig size={48} /></p>
                    <h2>My For Later Shelf</h2>
                    <p>Keep a reference of the items you would like to read, listen to, or watch in the future. When these items become available, they will show here.</p>
                    
                </div>
            </div>
            <div className={shelvestyle.buttonWrapper}>
                <NavLink>
                    <button>Go To Shelf <ArrowRight /></button>
                </NavLink>
            </div>
            
        </div>
    )
}

export default ShelveComponent
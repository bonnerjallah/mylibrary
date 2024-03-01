import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, } from "@fortawesome/free-solid-svg-icons"
import { Facebook, Instagram, Twitter } from 'lucide-react';


import footer from "../styles/footerstyle.module.css"


const Footer = () => {
    return (
        <div className={footer.mainContainer}>
            <div className={footer.newletterContainer}>
                <div>
                    <div>
                        <h1>Join the Newsletter</h1>
                        <p>Dive into the latest books and blogs</p>
                    </div>
                    <form>
                        <label htmlFor="forNewsleterEmail"></label>
                        <input type="email" name="email" id="forNewsleterEmail" placeholder="Enter email address" required />
                        <button><FontAwesomeIcon icon={faArrowRight} style={{fontSize:"1rem", width:"2rem"}} /> </button>
                    </form>
                </div>

                &copy; 2024 Consious Book Club. All Rights Reserved.
            </div>
            <div className={footer.socialIcons}>
                <Facebook  size={48} className={footer.facebook} />
                <Instagram size={48} className={footer.instagram}/>
                <Twitter size={48} className={footer.twiter} />
            </div>

        </div>
    )
}

export default Footer
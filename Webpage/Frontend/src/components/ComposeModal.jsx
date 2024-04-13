import { Send, MessageCircleOff } from 'lucide-react';
import composemodalstyle from "../styles/composemodalstyle.module.css"



const ComposeModal = ({closeModal}) => {
    return (
        <div className={composemodalstyle.mainContainer}>
            <p onClick={(e) => {closeModal(false)}}>X</p>
            <div className={composemodalstyle.messageBoxWrapper}>
                <div className={composemodalstyle.userAndContactWrapper}>
                    <div className={composemodalstyle.userWrapper}>
                        user image
                    </div>
                    <div className={composemodalstyle.contactWrapper}>
                        followers
                    </div>
                </div>
                <div className={composemodalstyle.composeFormWrapper}>
                    <form >
                        <label htmlFor="ComposeMessage"></label>
                        <textarea name="sendMsg" id="" cols="30" rows="10"></textarea>
                        <div>
                            <button className={composemodalstyle.sendButton}><Send />Send</button>
                            <button className={composemodalstyle.cancleButton}><MessageCircleOff />Cancle</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ComposeModal
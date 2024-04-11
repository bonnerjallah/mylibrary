import messagemodalstyle from "../styles/messagemodalstyle.module.css"
import { MessageCircleReply, Trash2 } from 'lucide-react';



const ReadMessageModal = ({close}) => {
    return (
        <div className={messagemodalstyle.msgModalMainContainer}>
                <p onClick={(e) => {close(false)}}>X</p>
                <div className={messagemodalstyle.readContainer}>
                    <div className={messagemodalstyle.senderPicAndNameWrapper}>
                        <div>
                            user pic
                        </div>
                        <div>
                            user name
                        </div>
                    </div>
                    <div className={messagemodalstyle.messageWrapper}>
                        message
                    </div>

                </div>
                <div className={messagemodalstyle.ButtonWrapper}>
                    <button> <MessageCircleReply size={25}/>Reply</button>
                    <button> <Trash2 size={25} />Delete</button>
                </div>
        </div>
    )
}

export default ReadMessageModal
import {Barcode, ChevronRight} from "lucide-react"

import dashboardsidebarstyle from "../styles/dashboardsidebarstyle.module.css"

const Myborrowing = () => {
    return (
        <div className={dashboardsidebarstyle.borrowMainContainer}>
            <div className={dashboardsidebarstyle.borrowingHeader}>
                <h2><Barcode size={28} /> My Borrowing</h2>
            </div>
            <div className={dashboardsidebarstyle.CheckOutHoldFeesWrapper}>
                <div>
                    <p>Checked Out</p>
                    <span>0 <ChevronRight /></span>
                </div>
                <div>
                    <p>On Hold</p>
                    <span>0 <ChevronRight /></span>
                </div>
                <div>
                    <p>Fees</p>
                    <span>0 <ChevronRight /></span>
                </div>
            </div>
        </div>
    )
}

export default Myborrowing
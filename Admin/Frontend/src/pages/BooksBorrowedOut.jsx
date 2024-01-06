import Navbar from '../components/Navbar'


import booksborrowedoutstyle from "../styles/booksborrowedoutstyle.module.css"



const BooksBorrowedOut = () => {
    return (
        <>
            <div className={booksborrowedoutstyle.mainContainer}>
                <div className={booksborrowedoutstyle.headerWrapper}>
                    <h1>Books Management</h1>
                </div>

                <div className={booksborrowedoutstyle.catalogWrapper}>
                    <h2>Complete Catalog</h2>
                    <div>
                        
                    </div>
                </div>

                <div className={booksborrowedoutstyle.managementWrapper}>
                    <div className={booksborrowedoutstyle.booksOut}>
                        <h2>Books Out</h2>
                    </div>

                    <div className={booksborrowedoutstyle.booksOnHold}>
                        <h2>Books On Hold</h2>
                    </div>
                </div>

            </div>
            
        </>
    )
}

export default BooksBorrowedOut
import bookcheckoutmodalstyle from "../styles/bookcheckoutmodalstyle.module.css"

const BookCheckedOutModal = ({closeModal}) => {
    return (
        <div className={bookcheckoutmodalstyle.mainContainer}>
            <div className={bookcheckoutmodalstyle.closeWrapper}>
                <p onClick={() => {closeModal(false)}}>X</p>
            </div>
            <div className={bookcheckoutmodalstyle.headerWrapper}>   
                <h1>Books Out</h1>
            </div>
            <div className={bookcheckoutmodalstyle.booksContainer}>

            </div>
        </div>
    )
}

export default BookCheckedOutModal
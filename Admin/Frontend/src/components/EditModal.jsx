import { useState } from "react"
import modalstyle from "../styles/modalstyle.module.css"



const EditModal = ({closeEditModal, dataToEdit}) => {
    console.log(dataToEdit)

    const [editInputData, setEditInputData] = useState({
        bookTitle: "",
        bookAuthor: "",
        bookPublishDate: "",
    })
    
    const [bookAvailableCheckBox, setBookAvailableCheckBox] = useState({
        bookAvailableYes : false,
        bookAvailableNo: false
    })

    const handleEditInputData = (e, discription) => {
        const {name, checked, value, type} = e.target 

        if(type === "checkbox") {
            setBookAvailableCheckBox((prev) => ({
                ...prev,
                [name] : checked,
                [name + "_discription"] : checked ? discription : prev[name + "_discription"]
            }))
        } else {
            setEditInputData((prev) => ({
                ...prev,
                [name]: value
            }))
        }
    }   


    return (
        <div className={modalstyle.mainContainer}>
            <div className={modalstyle.bookWrapper}>
                <div className={modalstyle.closeX}>
                    <p onClick={() => {closeEditModal(false)}}>X</p>
                </div>
                <div className={modalstyle.bookInfoWrapper}>
                    <img src={`http://localhost:3001/booksimages/${dataToEdit.bookImageUrl}`} alt="" width={120} height={200} />
                    <div className={modalstyle.formWrapper}>
                        <form>
                            <div>
                            <label htmlFor=" title">Title:<input type="text" name="bookTitle" id="title" value={dataToEdit.bookTitle} onChange={handleEditInputData} /></label>
                            <label htmlFor="author">Author:<input type="text" name="bookAuthor" id="author"  value={dataToEdit.bookAuthor} onChange={handleEditInputData} /></label>
                            <label htmlFor="pubDate">Publish Date:<input type="date" name="bookPublishDate" id="pubDate" onChange={handleEditInputData}/></label>
                            </div>
                            
                            <div className={modalstyle.checkedBoxOptions}>
                                <label htmlFor="availableYes">Yes:<input type="checkbox" name="bookAvailableYes" checked={bookAvailableCheckBox.bookAvailableYes} id="bookAvailableYes" onChange={(e) => {handleSuggestionEditInputData(e, "Yes")}} /></label>
                                <label htmlFor="availableNo">No: <input type="checkbox" name="bookAvailableNo" checked={bookAvailableCheckBox.bookAvailableNo} id="bookAvailableNo" onChange={(e) => {handleSuggestionEditInputData(e, "No")}} /></label>
                            </div>
                            
                            <button className={modalstyle.editFormButton}>Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditModal
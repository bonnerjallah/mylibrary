import { useState } from "react"
import modalstyle from "../styles/modalstyle.module.css"



const EditSuggestionsModal = ({closeSuggestionsEditModal, suggDataToEdit}) => {
    console.log("suggestion to edit:", suggDataToEdit)



    const [suggestionInputData, setSuggestionInputData] = useState({
        bookTitle: "",
        bookAuthor: "",
        bookPublishDate: "",
    })

    const [bookAvailableCheckBox, setBookAvailableCheckBox] = useState({
        bookAvailableYes: false,
        bookAvailableNo: false
    })

    const handleSuggestionEditInputData = (e, _discription) => {
        const {name, value, type, checked} = e.target 

        if(type === "checked") {
            setBookAvailableCheckBox((prev) => ({
                ...prev,
                [name] : checked,
                [name + _discription] : checked ? _discription : prev[name + "_discription"]
            }))
        } else {
            setSuggestionInputData((prev) => ({
                ...prev,
                [name] : value
            }))
        }
    }
    

    return (
        <div className={modalstyle.suggestionMainContainer}>
            <div className={modalstyle.bookWrapper}>
                <div className={modalstyle.closeX}>
                    <p onClick={() => closeSuggestionsEditModal(false)}>X</p>
                </div>
                <div className={modalstyle.bookInfoWrapper}>
                    <div className={modalstyle.bookInfoWrapper}>
                        <img src={`http://localhost:3001/booksimages/${suggDataToEdit.bookImageUrl}`} alt="" width={120} height={200} />
                        <div className={modalstyle.formWrapper}>
                            <form>
                                <div>
                                <label htmlFor=" title">Title:<input type="text" name="bookTitle" id="title" value={suggDataToEdit.bookTitle} onChange={handleSuggestionEditInputData} /></label>
                                <label htmlFor="author">Author:<input type="text" name="bookAuthor" id="author"  value={suggDataToEdit.bookAuthor} onChange={handleSuggestionEditInputData} /></label>
                                <label htmlFor="pubDate">Publish Date:<input type="date" name="bookPublishDate" id="pubDate" onChange={handleSuggestionEditInputData}/></label>
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
        </div>
    )
}

export default EditSuggestionsModal
import { useState } from "react"
import modalstyle from "../styles/modalstyle.module.css"

import axios from "axios"


const backEndUrl = import.meta.env.VITE_BACKEND_URL


const EditSuggestionsModal = ({closeSuggestionsEditModal, suggDataToEdit}) => {

    const [suggestionInputData, setSuggestionInputData] = useState(suggDataToEdit)

    const [bookAvailableCheckBox, setBookAvailableCheckBox] = useState({
        bookAvailableYes: false,
        bookAvailableNo: false
    })

    const [bookImageUrl, setBookImageUrl] = useState(null)

    const handleSuggestionEditInputData = (e, discription) => {
        const {name, value, type, checked} = e.target 

        if(type === "checkbox") {
            setBookAvailableCheckBox((prev) => ({
                ...prev,
                [name] : checked,
                [name + "_discription"] : checked ? discription : ""
            }))
        } else {
            setSuggestionInputData((prev) => ({
                ...prev,
                [name] : value
            }))
        }
    }


    const handleEditInputSubmit = async (e) => {
        e.preventDefault()

        const userConfirmed = window.confirm("Are you sure you want to update this data?")

        if(!userConfirmed){
            return
        }

        const { _id } = suggDataToEdit
        const formData = new FormData()

        formData.append("bookTitle", suggestionInputData.bookTitle)
        formData.append("bookAuthor", suggestionInputData.bookAuthor)
        formData.append("bookPublishDate", suggestionInputData.bookPublishDate)

        const availability = bookAvailableCheckBox.bookAvailableYes ? "Yes" : (bookAvailableCheckBox.bookAvailableNo ? "No" : "")
        formData.append("bookAvailability", availability)

        if(bookImageUrl) {
            console.log("book image", bookImageUrl)
            formData.append("bookImage", bookImageUrl, bookImageUrl.name)
        }

        try {
            const response = await axios.put(`${backEndUrl}/editSuggestedBook/${_id}`, formData) 

            if(response.status === 200) {
                setSuggestionInputData({
                    bookTitle: "",
                    bookAuthor: "",
                    bookPublishDate: ""
                })

                setBookAvailableCheckBox({
                    bookAvailableYes: false,
                    bookAvailableNo: false
                })
            } else {
                console.log("Error inserting book data", response.data)
            }
            
        } catch (error) {
            console.log("Error inserting Data", error)
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
                        <img src={`${backEndUrl}/booksimages/${suggDataToEdit.bookImageUrl}`} alt="" width={120} height={200} />
                        <div className={modalstyle.formWrapper}>
                            <form onSubmit={handleEditInputSubmit} encType="multipart/form-data" method="PUT">
                                <div>
                                    <label htmlFor=" title">Title:<input type="text" name="bookTitle" id="title" value={suggestionInputData.bookTitle || ""} onChange={handleSuggestionEditInputData} /></label>
                                    <label htmlFor="author">Author:<input type="text" name="bookAuthor" id="author"  value={suggestionInputData.bookAuthor || ""} onChange={handleSuggestionEditInputData} /></label>
                                    <label htmlFor="pubDate">Publish Date:<input type="date" name="bookPublishDate" id="pubDate" onChange={handleSuggestionEditInputData}/></label>
                                </div>
                                
                                <div className={modalstyle.checkedBoxOptions}>
                                    <label htmlFor="availableyes">Yes:<input type="checkbox" name="bookAvailableYes" checked={bookAvailableCheckBox.bookAvailableYes} id="bookAvailableyes" onChange={(e) => {handleSuggestionEditInputData(e, "Yes")}} /></label>
                                    <label htmlFor="availableno">No: <input type="checkbox" name="bookAvailableNo" checked={bookAvailableCheckBox.bookAvailableNo} id="bookAvailableno" onChange={(e) => {handleSuggestionEditInputData(e, "No")}} /></label>
                                </div>

                                <div>
                                    <label htmlFor="BookImage">
                                        Image:
                                        <input type="file" accept="image/*" name="bookImage" id="BookImage" onChange={(e) => {setBookImageUrl(e.target.files[0])}} />
                                    </label>
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
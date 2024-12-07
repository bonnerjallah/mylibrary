import { useState, useEffect } from "react"
import modalstyle from "../styles/modalstyle.module.css"

import axios from "axios"

const backEndUrl = import.meta.env.VITE_BACKEND_URL



const EditModal = ({closeEditModal, dataToEdit}) => {

    const [editInputData, setEditInputData] = useState(dataToEdit)
    
    const [bookAvailableCheckBox, setBookAvailableCheckBox] = useState({
        bookAvailableYes : false,
        bookAvailableNo: false
    })

    const [bookImageUrl, setBookImage] = useState(null)


    const handleEditInputData = (e, discription) => {
        const {name, value, type, checked} = e.target 

        if(type === "checkbox") {
            setBookAvailableCheckBox((prev) => ({
                ...prev,
                [name] : checked,
                [name + "_discription"] : checked ? discription : ""
            }))
        } else {
            setEditInputData((prev) => ({
                ...prev,
                [name]: value
            }))
        }
    }  

    const handleImageEdit = (e) => {
        setBookImage(e.target.files[0])
    }
    

    const handleEditBookInputSubmit = async (e) => {
        e.preventDefault();
    
        const userConfirmed = window.confirm("Are you sure you want to update this data?");
    
        if (!userConfirmed) {
            return;
        }
    
        const { _id } = dataToEdit;
        const formData = new FormData();
    
        formData.append("bookTitle", editInputData.bookTitle);
        formData.append("bookAuthor", editInputData.bookAuthor);
        formData.append("bookPublishDate", editInputData.bookPublishDate);

        if(bookImageUrl) {
            formData.append("bookImage", bookImageUrl, bookImageUrl.name)
        }
    
        const availability = bookAvailableCheckBox.bookAvailableYes ? "Yes" : (bookAvailableCheckBox.bookAvailableNo ? "No" : "");
        formData.append("bookAvailability", availability);        

        try {
            const response = await axios.put(`${backEndUrl}/bookEdit/${_id}`, formData);
    
            if (response.status === 200) {
                console.log("Edit book successful");
                setEditInputData({
                    bookTitle: "",
                    bookAuthor: "",
                    bookPublishDate: ""
                });
    
                setBookAvailableCheckBox({
                    bookAvailableYes: false,
                    bookAvailableNo: false
                });
            } else {
                console.log("Error editing book data", response.data);
            }
        } catch (error) {
            console.log("Error editing book data", error);
        }
    };    
   
    
    
    

    return (
        <div className={modalstyle.mainContainer}>
            <div className={modalstyle.bookWrapper}>
                <div className={modalstyle.closeX}>
                    <p onClick={() => {closeEditModal(false)}}>X</p>
                </div>
                <div className={modalstyle.bookInfoWrapper}>
                    <img src={`${backEndUrl}/booksimages/${dataToEdit.bookImageUrl}`} alt="" width={120} height={200} />
                    <div className={modalstyle.formWrapper}>
                        <form onSubmit={handleEditBookInputSubmit} encType="multipart/form-data" method="PUT">
                            <div>
                                <label htmlFor="title">Title:<input type="text" name="bookTitle" id="title" value={editInputData.bookTitle || ""} onChange={handleEditInputData} /></label>
                                <label htmlFor="author">Author:<input type="text" name="bookAuthor" id="author"  value={editInputData.bookAuthor || ""} onChange={handleEditInputData} /></label>
                                <label htmlFor="pubDate">Publish Date:<input type="date" name="bookPublishDate" id="pubDate" onChange={handleEditInputData || ""}/></label>
                            </div>
                            
                            <div className={modalstyle.checkedBoxOptions}>
                                <label htmlFor="availableyes">Yes:<input type="checkbox" name="bookAvailableYes" checked={bookAvailableCheckBox.bookAvailableYes} id="availableyes" onChange={(e) => handleEditInputData(e, "Yes")} /></label>
                                <label htmlFor="availableno">No: <input type="checkbox" name="bookAvailableNo" checked={bookAvailableCheckBox.bookAvailableNo} id="availableno" onChange={(e) => handleEditInputData(e, "No")} /></label>
                            </div>

                            <div>
                                <label htmlFor="BookImage">
                                    Image:
                                    <input type="file" accept="image/*" name="bookImage" id="BookImage" onChange={handleImageEdit} />
                                </label>
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
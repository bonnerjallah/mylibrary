import Navbar from "../components/Navbar"

import addsuggestionsstyle from "../styles/addsuggestionsstyle.module.css"

const AddSuggestions = () => {
    return (
        <div>
            <div>
                <Navbar />
            </div>

            <div className={addsuggestionsstyle.mainContainer} >
                <form action="">
                <h1>Add Suggestions</h1>
                <fieldset>
                    <label htmlFor="title"></label>
                    <input type="text" name="bookTitle" id="title" placeholder="Book Title" required  />

                    <label htmlFor="author"></label>
                    <input type="text" name="bookAuthor" id="author" placeholder="Book Author" required />

                    <label htmlFor="genre"></label>
                    <input type="text" name="bookGenre" id="genre" placeholder="Book Genre" required />

                    <label htmlFor="isbn"></label>
                    <input type="number" name="bookIsbn" id="isbn" placeholder="ISBN" required />

                    <label htmlFor="description"></label>
                    <input type="text" name="bookDescription" id="description" placeholder="Description" required />

                    <label htmlFor="publishDate"></label>
                    <input type="date" name="bookPublishDate" id="publishDate" placeholder="Publish Date" required />

                    <div className={addsuggestionsstyle.innerfieldset}>
                        <div>
                        <h3>Availability</h3>
                        </div>
                        <div className={addsuggestionsstyle.availibilityWrapper}>
                        <label htmlFor="availableYes">Yes</label>
                        <input type="checkbox" name="bookAvailableyes" id="availableYes" />

                        <label htmlFor="availableno">No</label>
                        <input type="checkbox" name="bookAvailableno" id="availableno" />
                        </div>
                    
                    </div>

                    <div className={addsuggestionsstyle.textareaWrapper}>
                        <label htmlFor="about">About Author:
                            <textarea name="aboutAuthor" id="about" cols="30" rows="10" placeholder="About Author"> </textarea>
                        </label>
                    </div>

                    
                    <label htmlFor="image"></label>
                    <input type="file" name="bookImage" id="image" placeholder="Images" required style={{cursor: 'pointer'}}/>

                </fieldset>

                <div>
                    <button className={addsuggestionsstyle.addButton}>Submit</button>
                </div>
                </form>
            </div>        
        </div>
    )
}

export default AddSuggestions
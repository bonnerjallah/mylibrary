import { useState, useEffect } from "react"
import axios from "axios"

import booksborrowedoutstyle from "../styles/booksborrowedoutstyle.module.css"

//Modal
import EditModal from "../components/EditModal"
import EditSuggestionsModal from "../components/EditSuggestionsModal"



const BooksBorrowedOut = () => {

    const [catalogeData, setCatalogeData] = useState([])
    const [suggestionsData, setSuggestionsData] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const booksResponse = await axios.get("http://localhost:3001/books")
                const bookData = booksResponse.data

                const formatedData= bookData.map((elem) => {
                    const originalDate = new Date(elem.bookPublishDate)
                    const formatteDate = originalDate.toLocaleDateString('en-US', {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit"
                    })

                    elem.bookPublishDate = formatteDate
                    return elem
                })

                setCatalogeData(formatedData)
            
                const suggestionsResult = await axios.get("http://localhost:3001/suggestions")
                const suggestionsData = suggestionsResult.data

                const fomattedSuggestedData = suggestionsData.map((elem) => {
                    const originalSuggestedDate = new Date(elem.bookPublishDate)
                    const formattedSuggestedDate = originalSuggestedDate.toLocaleDateString("en-us", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit"
                    })

                    elem.bookPublishDate = formattedSuggestedDate
                    return elem
                })

                setSuggestionsData(fomattedSuggestedData)

            } catch (error) {
                console.log("error fetching data", error)
            }
        }

        fetchData()
    }, [])

    const [searchTerms, setSearchTerms] = useState('')
    const [searchCatagory, setSearchCatagory] = useState('')
    const [filteredBookData, setFilterBookData] = useState([])

    const handleKeyWordSearch = (e) => {
        e.preventDefault()

        const filteredData = catalogeData.filter((elem) => {
            if(searchCatagory === "Title") {
                return elem.bookTitle.toLowerCase().includes(searchTerms.toLowerCase())
            } else if(searchCatagory === "Author") {
                return elem.bookAuthor.toLowerCase().includes(searchTerms.toLowerCase())
            }

            return false
        })

        setFilterBookData(filteredData)
    }

    const [suggestSearchTerm, setSuggestSearchTerm] = useState("")
    const [suggestSearchCatagory, setSuggestSearchCatagory] = useState("")
    const [filterSuggestions, setfilterSuggestions] = useState([])

    const handleSuggestionsFilter = (e) => {
        e.preventDefault()
        
        const suggFilterData = suggestionsData.filter(elem => {
            if(suggestSearchCatagory === "Title") {
                return elem.bookTitle.toLowerCase().includes(suggestSearchTerm.toLowerCase())
            } else if(suggestSearchCatagory === "Author") {
                return elem.bookAuthor.toLowerCase().includes(suggestSearchTerm.toLowerCase())
            }

            return elem
        })

        setfilterSuggestions(suggFilterData)
    }

    //Modals Logics
    const [openEditModal, setOpenEditModal] = useState(false)
    const [dataToEdit, setDataToEdit] = useState()
    
    const handleOpenEditModal = (elem) => {
        setOpenEditModal(true)
        setDataToEdit(elem)
    }

    const [openSuggEditModal, setOpenSuggEditModal] = useState(false)
    const [suggDataToEdit, setSuggDataToEdit] = useState(false)

    const handleSuggestionsEditModal = (elem) => {
        setOpenSuggEditModal(true)
        setSuggDataToEdit(elem)
    }


    return (
        <>
            <div className={booksborrowedoutstyle.mainContainer}>
                <div className={booksborrowedoutstyle.headerWrapper}>
                    <h1>Books Management</h1>
                </div>

                <div className={booksborrowedoutstyle.managementWrapper}>
                    <div className={booksborrowedoutstyle.booksOut}>
                        <h2>Complete Cataloge</h2>
                        <div className={booksborrowedoutstyle.bookskeywordSearch}>
                            <form onSubmit={handleKeyWordSearch}>
                                <label htmlFor="searchbooks">KeyWord:     
                                    <select id="searchByOption"  style={{marginLeft:".5rem"}} value={searchCatagory} onChange={(e) => setSearchCatagory(e.target.value)}>
                                        <option value=""></option>
                                        <option value="Title">Title</option>
                                        <option value="Author">Author</option>
                                    </select>
                                    <input type="text" name="srcbooks" id="searchbooks" value={searchTerms} onChange={(e) => setSearchTerms(e.target.value)} placeholder="Search Books" />
                                    <button className={booksborrowedoutstyle.keywordBttn} type="submit">Submit</button>
                                </label>
                            </form>     
                        </div>
                        <div className={booksborrowedoutstyle.completeCatalogeWrapper}>
                            {filteredBookData.length > 0 ? (
                                filteredBookData.map((elem, id) => (
                                    <div key={id} className={booksborrowedoutstyle.books}>
                                        <img src={`http://localhost:3001/booksimages/${elem.bookImageUrl}`} alt="Book Image" width={60} height={100} />
                                        <div>
                                            <p>Title: <span style={{ color: "#bc4b51" }}>{elem.bookTitle}</span></p>
                                            <p>Author: <span style={{ color: "#bc4b51" }}>{elem.bookAuthor}</span></p>
                                            <p>Publish Date: <span style={{ color: "#bc4b51" }}>{elem.bookPublishDate}</span></p>
                                            <p>Available: <span style={{ color: "#bc4b51" }}>{elem.bookAvailability}</span> </p>
                                        </div>
                                        <div className={booksborrowedoutstyle.editDeleteWrapper}>
                                            <button className={booksborrowedoutstyle.edit} onClick={() => handleOpenEditModal(elem)}>Edit</button>
                                            <button className={booksborrowedoutstyle.delete} >Delete</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                catalogeData.map((elem, id) => (
                                    <div key={id} className={booksborrowedoutstyle.books}>
                                        <img src={`http://localhost:3001/booksimages/${elem.bookImageUrl}`} alt="Book Image" width={60} height={100} />
                                        <div>
                                            <p>Title: <span style={{ color: "#bc4b51" }}>{elem.bookTitle}</span></p>
                                            <p>Author: <span style={{ color: "#bc4b51" }}>{elem.bookAuthor}</span></p>
                                            <p>Publish Date: <span style={{ color: "#bc4b51" }}>{elem.bookPublishDate}</span></p>
                                            <p>Available: <span style={{ color: "#bc4b51" }}>{elem.bookAvailability}</span> </p>
                                        </div>
                                        <div className={booksborrowedoutstyle.editDeleteWrapper}>
                                            <button className={booksborrowedoutstyle.edit} onClick={() => handleOpenEditModal(elem)}>Edit</button>
                                            <button className={booksborrowedoutstyle.delete}>Delete</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        {openEditModal && (<EditModal dataToEdit={dataToEdit} closeEditModal={setOpenEditModal}  />)}

                    </div>

                    <div className={booksborrowedoutstyle.booksOnHold}>
                        <h2>Suggestions Cataloge</h2>
                        <div className={booksborrowedoutstyle.suggestionskeywordSearch}>
                            <form onSubmit={handleSuggestionsFilter}>
                                <label htmlFor="searchbooks">KeyWord:
                                    <select id="suggestionsSearchBy" style={{marginLeft:".5rem"}} value={suggestSearchCatagory} onChange={(e) => setSuggestSearchCatagory(e.target.value)}>
                                        <option value=""></option>
                                        <option value="Title">Title</option>
                                        <option value="Author">Author</option>
                                    </select>
                                    <input type="text" name="srcbooks" id="searchbooks" placeholder="Search Books" value={suggestSearchTerm} onChange={(e) => setSuggestSearchTerm(e.target.value)} />
                                    <button className={booksborrowedoutstyle.suggestKeywordBttn} type="submit">Submit</button>
                                </label>
                            </form>
                        </div>

                        <div className={booksborrowedoutstyle.suggestionsCatalogeWrapper}>
                            {filterSuggestions.length > 0 ? 
                                (filterSuggestions.map((elem, id)=> (
                                    <div key={id}  className={booksborrowedoutstyle.books}>
                                        <img src={`http://localhost:3001/booksimages/${elem.bookImageUrl}`} alt="book image" width={60} height={100} />
                                        <div>
                                            <p>Title: <span style={{color: "#bc4b51"}}>{elem.bookTitle}</span></p>
                                            <p>Author: <span style={{color: "#bc4b51"}}>{elem.bookAuthor}</span></p>
                                            <p>Publish Date: <span style={{color: "#bc4b51"}}>{elem.bookPublishDate}</span></p>
                                            <p>Available: <span style={{color: "#bc4b51"}}>{elem.bookAvailability}</span> </p>
                                        </div>
                                        <div className={booksborrowedoutstyle.editDeleteWrapper}>
                                            <button className={booksborrowedoutstyle.edit} onClick={(e) => handleSuggestionsEditModal(elem)}>Edit</button>
                                            <button className={booksborrowedoutstyle.delete} onClick={(e) => handleSuggestionsEditModal(elem)}>Delete</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                suggestionsData.map((elem, id) => (
                                    <div key={id} className={booksborrowedoutstyle.books} >
                                        <img src={`http://localhost:3001/booksimages/${elem.bookImageUrl}`} alt="Book Image" width={60} height={100}  />
                                        <div>
                                            <p>Title: <span style={{color: "#bc4b51"}}>{elem.bookTitle}</span></p>
                                            <p>Author: <span style={{color: "#bc4b51"}}>{elem.bookAuthor}</span></p>
                                            <p>Publish Date: <span style={{color: "#bc4b51"}}>{elem.bookPublishDate}</span></p>
                                            <p>Available: <span style={{color: "#bc4b51"}}>{elem.bookAvailability}</span> </p>
        
                                        </div>
                                        <div className={booksborrowedoutstyle.editDeleteWrapper}>
                                            <button className={booksborrowedoutstyle.edit} onClick={(e) => handleSuggestionsEditModal(elem)}>Edit</button>
                                            <button className={booksborrowedoutstyle.delete} onClick={(e) => handleSuggestionsEditModal(elem)}>Delete</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        {openSuggEditModal && (<EditSuggestionsModal suggDataToEdit={suggDataToEdit} closeSuggestionsEditModal={setOpenSuggEditModal}/>)}
                    </div>
                </div>
            </div>
            
        </>
    )
}

export default BooksBorrowedOut
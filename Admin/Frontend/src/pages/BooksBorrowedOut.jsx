import { useState, useEffect } from "react"
import axios from "axios"

import booksborrowedoutstyle from "../styles/booksborrowedoutstyle.module.css"



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

    console.log("Book Data", catalogeData)




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
                            <form>
                                <label htmlFor="searchbooks">KeyWord Search:
                                    <input type="text" name="srcbooks" id="searchbooks" placeholder="Search Books" />
                                </label>
                            </form>
                        </div>
                        <div className={booksborrowedoutstyle.completeCatalogeWrapper}>

                            {catalogeData && catalogeData.map((elem, id) => (
                                <div key={id} className={booksborrowedoutstyle.books}>
                                    <img src={`http://localhost:3001/booksimages/${elem.bookImageUrl}`} alt="Book Image" width={60} height={100}  />
                                    <div>
                                        <p>Title: <span style={{color: "#bc4b51"}}>{elem.bookTitle}</span></p>
                                        <p>Author: <span style={{color: "#bc4b51"}}>{elem.bookAuthor}</span></p>
                                        <p>Publish Date: <span style={{color: "#bc4b51"}}>{elem.bookPublishDate}</span></p>
                                        <p>Available: <span style={{color: "#bc4b51"}}>{elem.bookAvailability}</span> </p>

                                    </div>
                                    <div className={booksborrowedoutstyle.editDeleteWrapper}>
                                        <button className={booksborrowedoutstyle.edit}>Edit</button>
                                        <button className={booksborrowedoutstyle.delete}>Delete</button>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>

                    <div className={booksborrowedoutstyle.booksOnHold}>
                        <h2>Suggestions Cataloge</h2>
                        <div className={booksborrowedoutstyle.suggestionskeywordSearch}>
                            <form>
                                <label htmlFor="searchbooks">KeyWord Search:
                                    <input type="text" name="srcbooks" id="searchbooks" placeholder="Search Books" />
                                </label>
                            </form>
                        </div>
                        <div className={booksborrowedoutstyle.suggestionsCatalogeWrapper}>

                        {suggestionsData && suggestionsData.map((elem, id) => (
                            <div key={id} className={booksborrowedoutstyle.books} >
                                <img src={`http://localhost:3001/booksimages/${elem.bookImageUrl}`} alt="Book Image" width={60} height={100}  />
                                <div>
                                        <p>Title: <span style={{color: "#bc4b51"}}>{elem.bookTitle}</span></p>
                                        <p>Author: <span style={{color: "#bc4b51"}}>{elem.bookAuthor}</span></p>
                                        <p>Publish Date: <span style={{color: "#bc4b51"}}>{elem.bookPublishDate}</span></p>
                                        <p>Available: <span style={{color: "#bc4b51"}}>{elem.bookAvailability}</span> </p>

                                    </div>
                                <div className={booksborrowedoutstyle.editDeleteWrapper}>
                                    <button className={booksborrowedoutstyle.edit}>Edit</button>
                                    <button className={booksborrowedoutstyle.delete}>Delete</button>
                                </div>
                            </div>
                            
                        ))}

                        </div>
                    </div>
                </div>

            </div>
            
        </>
    )
}

export default BooksBorrowedOut
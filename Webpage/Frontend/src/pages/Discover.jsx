import { useState, useEffect } from "react"
import axios from "axios"

import ScrollToTop from "../components/ScrollToTop"

import discoverstyle from "../styles/discoverstyle.module.css"
import { NavLink } from "react-router-dom"


const Discover = () => {

    const [suggestedBooks, setSuggestedBooks] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [bookSuggestionPerPage, setBookSuggestionPerPage] = useState(5)

    useEffect(() => {
        const fetchSuggestedBooks = async () => {
            try {
                const response = await axios.get("http://localhost:3001/suggestedBooks")
                setSuggestedBooks(response.data)
                
            } catch (error) {
                console.log("Error fetching suggested books", error)
            }
        }
        fetchSuggestedBooks()
    }, [])

    console.log(suggestedBooks)

    const lastBookIndex = currentPage * bookSuggestionPerPage
    const firstBookIndex = lastBookIndex - bookSuggestionPerPage
    const currentSuggestedBook = suggestedBooks.slice(firstBookIndex, lastBookIndex)

    //Pagination
    const pageNumbers = []

    const totalSuggestedBooks = suggestedBooks.length
    const suggestedBooksToShowPerPage = bookSuggestionPerPage

    for(let i = 1; i <= Math.ceil(totalSuggestedBooks / suggestedBooksToShowPerPage); i++) {
        pageNumbers.push(i)
    }

    //Function to move to the next page
    const handleNextPage = (nextPage) => {
        setCurrentPage(nextPage)
    }


    return (
        <>
            <ScrollToTop />
            <div  className={discoverstyle.pageHeader}>
                <h1>Uncover the discoverable.</h1>
            </div>
            <div className={discoverstyle.mainContainer} >
                <div className={discoverstyle.paginationWrapper}>
                    {pageNumbers.map((nextPage) => (
                        <li key={nextPage} onClick={() => handleNextPage(nextPage)} style={{backgroundColor : currentPage === nextPage ? "#000000" : "#2297c3", color : currentPage === nextPage ? "orange" : ''}} >
                            {nextPage}
                        </li>
                    ))}
                </div>
                <div className={discoverstyle.booksContainer}>
                    {currentSuggestedBook && currentSuggestedBook.map((elem, index) => (
                        <div key={index} className={discoverstyle.booksWrapper}>
                            <NavLink to={`/BookDetails/${elem._id}`} >
                                <div className={discoverstyle.bookImageWrapper}>
                                    <img src={`http://localhost:3001/booksimages/${elem.bookImageUrl}`} alt="book image" width="200" height="300" style={{margin:" .2rem.2rem"}} />
                                </div>
                            </NavLink>
                            <div>
                                <div className={discoverstyle.bookTitleWrapper}>
                                    <p>Title: <span>{elem.bookTitle}</span> </p>
                                    <p>Author: <span>{elem.bookAuthor}</span></p>
                                    <p>Ratings: <small>{elem.Ratings}</small></p>
                                </div>
                                <div className={discoverstyle.bookdiscriptionWrapper}>
                                    <p>{elem.bookDiscription && elem.bookDiscription.split(/\s+/).slice(0, 150).join(' ')}...</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={discoverstyle.paginationWrapper} style={{borderTop:"1px solid #168aad"}}>
                    {pageNumbers.map((nextPage) => (
                        <li key={nextPage} onClick={() => handleNextPage(nextPage)} style={{backgroundColor : currentPage === nextPage ? "#000000" : "#2297c3", color : currentPage === nextPage ? "orange" : ''}}>
                            {nextPage}
                        </li>
                    ))}
                </div>
                
            </div>
        </>
        
    )
}

export default Discover
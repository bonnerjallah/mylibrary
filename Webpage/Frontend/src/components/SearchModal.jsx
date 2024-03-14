import { Search } from "lucide-react"
import shelfstyle from "../styles/shelfstyle.module.css"

import { useState, useEffect } from "react"
import axios from "axios"

const SearchModal = ({closeModal}) => {

    const [allBooks, setAllBooks] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [booksPerPage, setBooksPerPage] = useState(15)


    useEffect(() => {
        const fetchBooksData = async () => {
            try {
                const catalogBooksResponse = await axios.get("http://localhost:3001/catalogbooks")
                const catalogBooks = (catalogBooksResponse.data)

                const suggestionsBooksResponse = await axios.get("http://localhost:3001/suggestedBooks")
                const suggestedBooks = (suggestionsBooksResponse.data)

                const combineBooks = [...catalogBooks, ...suggestedBooks]

                setAllBooks(combineBooks)
                
            } catch (error) {
                console.log("Error fetching books", error)
            }
        }
            fetchBooksData()
    }, [])

    console.log("allBooks", allBooks)

    const lastBookIndex = currentPage * booksPerPage
    const firstBookIndex = lastBookIndex - booksPerPage
    const currentBookPage = allBooks.slice(firstBookIndex, lastBookIndex)

    //Pagination
    const pageNumber = []

    const totalSuggestedBooks = allBooks.length
    const booksToShowPerPage = booksPerPage

    for(let i = 1; i <= Math.ceil(totalSuggestedBooks / booksToShowPerPage); i++) {
        pageNumber.push(i)
    }

    //Fuction to move pages
    const handleNextPage = (nextPage) => {
        setCurrentPage(nextPage)
    }




    return (
        <div className={shelfstyle.modalMainContainer}>
            <div>
                <div className={shelfstyle.closeModalX}>
                    <p onClick={(e) => {closeModal(false)}}>X</p>
                </div>
                <div className={shelfstyle.searchContainer}>
                <p style={{marginBottom:".5rem", fontSize:"1.2rem"}}>Search by Keyword</p>
                    <form>
                        <label htmlFor="Search"></label>
                        <input type="text" name="search" id="Search"  />
                        <div className={shelfstyle.searchIconWrapper}>
                            <Search size={48} />
                        </div>
                    </form>
                    <div>
                        {currentBookPage && currentBookPage.map((elem, index) => (
                            <div key={index} >
                                {elem.bookTitle}
                            </div>
                        ))}
                    </div>
                    <div>
                        {pageNumber.map((nextPage) => (
                            <li key={nextPage} onClick={() => handleNextPage(nextPage)}>
                                {nextPage}
                            </li>
                        ))}
                    </div>

                </div>

            </div>
            
        </div>
    )
}

export default SearchModal
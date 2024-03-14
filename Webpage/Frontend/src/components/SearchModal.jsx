import { Plus, Search } from "lucide-react"
import shelfstyle from "../styles/shelfstyle.module.css"

import { useState, useEffect } from "react"
import axios from "axios"

const SearchModal = ({closeModal}) => {

    const [searchCatagory, setSearchCatagory] = useState("")
    const [searchInput, setSearchInput] = useState({
        search: "" 
    })
    const [filteredBookData, setFilterBookData] = useState([])

    const [allBooks, setAllBooks] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [booksPerPage] = useState(10)


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

    const lastBookIndex = currentPage * booksPerPage
    const firstBookIndex = lastBookIndex - booksPerPage
    const currentBookPage = filteredBookData.length > 0 ? filteredBookData.slice(firstBookIndex, lastBookIndex) :  allBooks.slice(firstBookIndex, lastBookIndex)

    //Pagination
    const pageNumber = []

    const totalBooks = filteredBookData.length > 0 ? filteredBookData.length : allBooks.length;
    const booksToShowPerPage = booksPerPage

    for(let i = 1; i <= Math.ceil(totalBooks / booksToShowPerPage); i++) {
        pageNumber.push(i)
    }

    //Fuction to move pages
    const handleNextPage = (nextPage) => {
        setCurrentPage(nextPage)
    }

    const searchInputData = (e) => {
        const {name, value} = e.target
        setSearchInput((prev) => ({
            ...prev,
            [name] : value
        }))
    }

    const handleSearchSubmit =  (e) => {
        e.preventDefault()

        const filteredBook = allBooks.filter(elem => {
            if(searchCatagory === "title") {
                return elem.bookTitle.toLowerCase().includes(searchInput.search.toLowerCase())
            } else if (searchCatagory === "author") {
                return elem.bookAuthor.toLowerCase().includes(searchInput.search.toLowerCase())
            }

            return false
        })

        setFilterBookData(filteredBook)
        setSearchInput("")
    }




    return (
        <div className={shelfstyle.modalMainContainer}>
            <div>
                <div className={shelfstyle.closeModalX}>
                    <p onClick={(e) => {closeModal(false)}}>X</p>
                </div>
                <div className={shelfstyle.searchContainer}>
                    <p style={{marginBottom:".5rem", fontSize:"1.2rem"}}>
                        Search by Keyword: 
                        <select onChange={(e) => {setSearchCatagory(e.target.value)}} style={{marginLeft:".5rem"}}>
                            <option value=""></option>
                            <option value="title">Title</option>
                            <option value="author">Author</option>
                        </select>
                    </p>
                    <form onSubmit={handleSearchSubmit}>
                        <label htmlFor="Search"></label>
                        <input type="text" name="search" id="Search" value={searchInput.search} onChange={searchInputData} />
                        <div  className={shelfstyle.searchIconWrapper}>
                            <button type="submit"><Search size={48} /></button>
                        </div>
                    </form>
                    <div className={shelfstyle.pageNumberWrapper} style={{marginTop:".5rem"}}>
                        {pageNumber.map((nextPage) => (
                            <li key={nextPage} onClick={() => handleNextPage(nextPage)} style={{backgroundColor: currentPage === nextPage ? "white" : "black", color: currentPage === nextPage ? "black" : "white"}}>
                                {nextPage}
                            </li>
                        ))}
                    </div>
                    <div className={shelfstyle.booksContainer}>
                        {currentBookPage && currentBookPage.map((elem, index) => (
                            <div key={index} className={shelfstyle.booksWrapperWrapper} >
                                <div className={shelfstyle.bookWrapper}>
                                    <img src={`http://localhost:3001/booksimages/${elem.bookImageUrl}`} alt="book image" width="60" height="65" />
                                    <div>
                                        {elem.bookTitle}
                                    </div>
                                </div>
                                
                                <div className={shelfstyle.addToWrapper}>
                                    <p ><Plus size={28} className={shelfstyle.addBookPlus}/> Add</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={shelfstyle.pageNumberWrapper} style={{marginTop:".5rem"}}>
                        {pageNumber.map((nextPage) => (
                            <li key={nextPage} onClick={() => handleNextPage(nextPage)} style={{backgroundColor: currentPage === nextPage ? "white" : "black", color: currentPage === nextPage ? "black" : "white"}}>
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
import { useState, useEffect } from "react"
import axios from "axios"

import Footer from "../components/Footer"
import ScrollToTop from "../components/ScrollToTop"

import ourpicksstyle from "../styles/ourpicksstyle.module.css"
import { NavLink } from "react-router-dom"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStar, faStarHalf} from "@fortawesome/free-solid-svg-icons"


const backEndUrl = import.meta.env.VITE_BACKEND_URL


const Ourpicks = () => {

    const [catalogOfBooks, setCatalogOfBooks] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [booksPerPage] = useState(5)


    useEffect(() => {
        const fetchCatalogBooks = async () => {
            try {
                const response = await axios.get(`${backEndUrl}/books`)
                
                setCatalogOfBooks(response.data)

            } catch (error) {
                console.log("Error fetching books form database", error)
            }
        }
            fetchCatalogBooks()
    }, [])

    //Get Curerent book to display
    const indexOfLastBook = currentPage * booksPerPage
    const indexOfFirstBook = indexOfLastBook - booksPerPage
    const currentBooks = catalogOfBooks.slice(indexOfFirstBook, indexOfLastBook)

    //Pagination logic
    const pageNumbers = []

    const totalbooks = catalogOfBooks.length
    const booksToShowPerPage = booksPerPage

    for(let i = 1; i <= Math.ceil(totalbooks / booksToShowPerPage); i++) {
        pageNumbers.push(i)
    }

    //Function to go to next page
    const handleNextPage = (nextPage) => {
        setCurrentPage(nextPage);
    }


    return (
        <>
            <ScrollToTop />
            <div  className={ourpicksstyle.pageHeader}>
                <h1>Exploring different possibilities and adventures.</h1>
            </div>
            <div className={ourpicksstyle.mainContainer}>
                <div className={ourpicksstyle.paginationWrapper} >
                    {pageNumbers.map((nextPage) => (
                        <li key={nextPage} onClick={() => handleNextPage(nextPage)} style={{backgroundColor: currentPage === nextPage ? "#000000" : "", color: currentPage === nextPage ? "orange" : ""}}>
                            {nextPage}
                        </li>
                    ))}
                </div>
                <div className={ourpicksstyle.booksContainer}> 
                    {catalogOfBooks && currentBooks.map((elem, id) => (
                        <div key={id} className={ourpicksstyle.booksWrapper}> 
                            <NavLink to={`/BookDetails/${elem._id}`} >
                                <div className={ourpicksstyle.bookImageWrapper}>
                                    <img src={`${backEndUrl}/booksimages/${elem.bookImageUrl}`} alt="book image" width="200" height="300" style={{margin:" .2rem.2rem"}} />
                                </div>
                            </NavLink>
                            <div>
                                <div className={ourpicksstyle.bookTitleWrapper}>
                                    <p>Title: <span>{elem.bookTitle}</span> </p>
                                    <p>Author: <span>{elem.bookAuthor}</span></p>
                                    <p>Ratings: 
                                        {elem.ratings && elem.ratings > 0 ? (
                                            <small>
                                                {Array.from({length: Math.max(0, Math.floor(Number(elem.ratings)))},
                                                (_, i) => (
                                                    <FontAwesomeIcon key={i} icon={faStar} style={{ marginRight: "5px" }}/>
                                                ))}

                                                {elem.ratings % 1 !== 0 && (
                                                    <FontAwesomeIcon key={i} icon={faStarHalf} style={{ width: "20px", height: "20px", marginRight: "5px" }} />
                                                )}
                                            </small>
                                        ) : (
                                            ""
                                        )}
                                    </p>
                                </div>
                                <div className={ourpicksstyle.bookdiscriptionWrapper}>
                                    <p>{elem.bookDiscription && elem.bookDiscription.split(/\s+/).slice(0, 150).join(' ')}...</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={ourpicksstyle.paginationWrapper} style={{borderTop:"1px solid #168aad"}}>
                    {pageNumbers.map((nextPage) => (
                        <li key={nextPage} onClick={() => handleNextPage(nextPage)} style={{backgroundColor:currentPage === nextPage ? "#000000" : "#22c1c3", color: currentPage === nextPage ? "orange" : "" }}>
                            {nextPage}
                        </li>
                    ))}
                </div>
            </div>
            <div>
                <Footer />
            </div>
        </>
        
        
    )
}

export default Ourpicks
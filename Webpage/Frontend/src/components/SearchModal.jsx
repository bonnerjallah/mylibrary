import { Plus, Search } from "lucide-react"
import shelfstyle from "../styles/shelfstyle.module.css"
import { useAuth } from "./AuthContext"
import Cookies from "js-cookie"
import { useState, useEffect } from "react"
import axios from "axios"

const SearchModal = ({closeModal}) => {

    const user = useAuth()

    const [member, setMember] = useState('')
    const [searchCatagory, setSearchCatagory] = useState("")
    const [searchInput, setSearchInput] = useState({
        search: "" 
    })
    const [filteredBookData, setFilterBookData] = useState([])
    const [bookIsOnShelf, setBookIsOnShelf] = useState([])

    const [allBooks, setAllBooks] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [booksPerPage] = useState(10)

    const [userSuccessMsg, setUserSuccesMsg] = useState('')
    const [userErrorMsg, setUserErrorMsg] = useState('')
    

    //Fetch Books function
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

    //Fetch user function
    axios.defaults.withCredentials = true
    useEffect(() => {
        const fetchUserData = async () => {
            if(!user) return
            try {
                const token = Cookies.get("token")
                const response = await axios.get("http://localhost:3001/libraryusers", {
                    headers:{"Content-Type": "application/json", "Authorization": `Bearer${token}`}
                })
                response.data.valid ? setMember(response.data) : console.error("Error fetching from database", response.data)
            } catch (error) {
                console.error("Error fetching user data", error)
            }
        }
        fetchUserData()
    }, [])

    //Fetch Books On Shelf
    useEffect(() => {
        
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


    const handleAddToShelves = async (e, _id) => {
        e.preventDefault()

        const requestObject = {
            userid : member.user.id,
            bookid : _id
        }

        try {
            const response = await axios.post("http://localhost:3001/setbookshelf", requestObject, {
                headers: {"Content-Type": "application/json"}
            })

            if(response.status === 200) {
                setUserSuccesMsg("Book added to your shelf")

                setTimeout(() => {
                    setUserSuccesMsg('')
                }, 2000);

            }
            
        } catch (error) {
            console.log("Error inserting data", error)
            if(error.response && error.response.data && error.response.data.message){
                setUserErrorMsg(error.response.data.message)
                setTimeout(() => {
                    setUserErrorMsg("")
                }, 2000);
            }
        }
        
    }

    console.log("member", member)    


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
                                
                                <div className={shelfstyle.addToWrapper} onClick={(e) => {handleAddToShelves(e, elem._id)}}>
                                    <p ><Plus size={28} className={shelfstyle.addBookPlus}/> Add</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {userSuccessMsg && (<p className={shelfstyle.successfullyAdded}>{userSuccessMsg}</p>)}
                    {userErrorMsg && (<p className={shelfstyle.userErrorMessage}>{userErrorMsg}</p>)}

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
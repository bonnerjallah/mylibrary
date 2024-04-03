import { useState, useEffect } from "react"
import { useAuth } from "../components/AuthContext"
import Cookies from "js-cookie"
import axios from "axios"
import { NavLink, useParams } from "react-router-dom"
import { MoveLeft } from "lucide-react"
import bookdetailsstyle from "../styles/bookdetailsstyle.module.css"

const BookDetails = () => {

    const {_id} = useParams()
    const {user} = useAuth()

    console.log(_id)



    const [member, setMember] = useState('')
    const [allBooks, setAllBooks] = useState([])


    //Fetch user
    useEffect(() => {
        if(!user) return
        const fetchUserData = async () => {
            try {
                const token = Cookies.get("token")
                const response = await axios.get("http://localhost:3001/libraryusers", {
                    headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}
                })

                response.data.valid ? setMember(response.data) : console.error("error fetching user data form database", response.data)

                
            } catch (error) {
                console.error("error fetching user", error)
            }
        }

        fetchUserData()
    }, [])

    //Fetch all Books
    useEffect(() => {
        const fetchAllBooks = async () => {
            try {
                const catalogResponse = await axios.get("http://localhost:3001/catalogbooks")
                const catalogbooks = catalogResponse.data

                const formattedData = catalogbooks.map(elem => {
                    const originalDate = new Date(elem.bookPublishDate)
                    const formattedDate = originalDate.toLocaleDateString("en-US", {
                        year:"numeric",
                        month:"2-digit",
                        day:"2-digit"
                    })
                    elem.bookPublishDate = formattedDate
                    return elem
                })

                const suggestedBooksResponse = await axios.get("http://localhost:3001/suggestedBooks")
                const suggestedBooks = suggestedBooksResponse.data

                const suggestedBooksFormattedData = suggestedBooks.map(elem => {
                    const originalDate = new Date(elem.bookPublishDate)
                    const formattedDate = originalDate.toLocaleDateString("en-US", {
                        year:'numeric',
                        month:"2-digit",
                        day:"2-digit"
                    })
                    elem.bookPublishDate = formattedDate
                    return elem
                })

                const combineBooks = [...formattedData, ...suggestedBooksFormattedData]

                setAllBooks(combineBooks)


            } catch (error) {
                console.log("error fetching books", error)
            }
        }
        fetchAllBooks()
    }, [])


    console.log(member)
    console.log(allBooks)

    return (
        <div>

            <NavLink to="/Dashboard">
                <div className={bookdetailsstyle.backbutton}>
                    <p> <MoveLeft /> My Dashboard</p>
                </div>
            </NavLink>
            
            <div>
                <div>


                    
                </div>
                <div>
                    <h1>booktitle</h1>
                    <h3>Author, <span>Publish date</span> </h3>
                    <div>
                        <p>rating</p>
                        <p>your rating</p>
                    </div>
                    <div>
                        Paper back
                    </div>
                    <div>
                        book discription
                    </div>
                </div>
                <div>
                    <div>
                        <h2>Availble</h2>
                        <p>Copies</p>
                    </div>
                    <div>
                        <button>Place Hold</button>
                        <p></p>
                    </div>
                </div>
            </div>

            <div>
                <h3>About</h3>
                <div>
                    <h4>About the author</h4>
                </div>
            </div>

            <div>
                <h3>Opinion</h3>
                <div>
                    <h4>From reviewers</h4>
                </div>
                <div>
                    <h4>From the Community</h4>
                    <form>
                        <label htmlFor="comment">What did you think about this title?</label>
                        <input type="text" name="" id="comment" placeholder="Add comment" />
                    </form>
                </div>
            </div>

        </div>
    )
}

export default BookDetails
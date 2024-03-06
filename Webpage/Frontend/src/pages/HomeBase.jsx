import { useEffect, useState } from "react"
import {NavLink} from "react-router-dom"
import axios from "axios"
import homestyle from "../styles/homestyle.module.css"
import Fotter from "../components/Footer"
import ScrollToTop from "../components/ScrollToTop"


import openbrainbook from "/openbrainbook.jpg";
import home from "/home.jpg";
import aman from '/aman.jpg';
import brainbookinhand from "/brainbookinhand.jpg";
import bookpuzzle from "/bookpuzzle.jpg";
import blowbackhead from "/blowbackhead.jpg";


const Images = [openbrainbook, home, aman, brainbookinhand, bookpuzzle, blowbackhead]

//Image Slider
const ImageSlider = ({imageUrls}) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const showPrevImage = () => {
    setCurrentIndex(index => {
      if(index === 0) return imageUrls.length -1
      return index -1
    })
  }

  const showNextImage = () => {
    setCurrentIndex(index => {
      if(index === imageUrls.length - 1) return 0
      return index + 1
    })
  }

  const autoAdvanceSlider = () => {
    showNextImage()
  }

  useEffect(() => {
    const intervalId = setInterval(autoAdvanceSlider, 10000)

    return () => {
      clearInterval(intervalId)
    }
  }, [])



  return(
    <div style={{width:"100%", height:"380px", position: "relative"}}>
      <div style={{width: "100%", height: "100%", display: "flex", overflow: "hidden"}}>
        {imageUrls.map((url, index) => (
          <img key={index} 
          src={url}
          className={homestyle.imageSliderImage}
          style={{translate: `${-100 * currentIndex}%`}}
          />
        ))}
      </div>
    </div>
  )
}

const HomeBase = () => {

  const [staffList, setStaffList] = useState([])
  const [allBooks, setAllBooks] = useState([])
  const [bookOfTheWeek, setBookOfTheWeek] = useState([])
  const [currentDay, setCurrentDay] = useState('')

  useEffect(() => {
    const fetchbooks = async () => {
        try {
          const response = await axios.get("http://localhost:3001/catalogbooks")
          const catalogBooks = response.data

          const formattedBookData = catalogBooks.map(elem => {
            const originalDate = new Date(elem.bookPublishDate)
            const formatDate = originalDate.toLocaleString("en-US",{
              year: "numeric",
              month:"2-digit",
              day: "2-digit"
            })
            elem.bookPublishDate = formatDate
            return elem
          })

          setStaffList(formattedBookData)

          const suggestedBooksResponse = await axios.get("http://localhost:3001/suggestedBooks")
          const suggestions = suggestedBooksResponse.data

          const formattedSuggestedBooks = suggestions.map(elem => {
            const originalsuggestedBookDate = new Date(elem.bookPublishDate)
            const suggestedBookFormatDate = originalsuggestedBookDate.toLocaleString("en-US", {
              year:"numeric",
              month: "2-digit",
              day:"2-digit"
            })
            elem.bookPublishDate = suggestedBookFormatDate
            return elem
          })

          const combinedBooksData = [...formattedBookData, ...formattedSuggestedBooks]

          setAllBooks(combinedBooksData)

        } catch (error) {
          console.log("Error fetching book form database", error)
        }
    }

    fetchbooks()

  }, [])


  //Function to get a random book of the week.
  useEffect(() => {
    const selectWeeklyBook = () => {
        const randomNumber = Math.floor(Math.random() * allBooks.length);
        return allBooks[randomNumber];
    };

    const storedBook = localStorage.getItem('bookOfTheWeek');
    const storedTimestamp = localStorage.getItem('bookSelectionTimestamp');

    if (storedBook && storedTimestamp) {
        // Check if the stored book is valid (selected within the last seven days)
        const selectedTimestamp = new Date(storedTimestamp).getTime();
        const currentTimestamp = new Date().getTime();
        const timeDifference = currentTimestamp - selectedTimestamp;
        const millisecondsInSevenDays = 7 * 24 * 60 * 60 * 1000;

        if (timeDifference <= millisecondsInSevenDays) {
            try {
                // Attempt to parse the stored book as JSON
                const parsedBook = JSON.parse(storedBook);
                setBookOfTheWeek(parsedBook);
                return; // Exit early if a valid book is found in storage
            } catch (error) {
                console.error('Error parsing stored book:', error);
                // Handle the error here, e.g., by selecting a new book
            }
        }
    }

    // If no valid book found in storage or error occurred, select a new book and update local storage
    const selectedBook = selectWeeklyBook();
    setBookOfTheWeek(selectedBook);
    localStorage.setItem('bookOfTheWeek', JSON.stringify(selectedBook));
    localStorage.setItem('bookSelectionTimestamp', new Date().toISOString());

}, [allBooks]);







  //Function to get the current day and date
  useEffect(() => {
    const today = new Date()
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }; //Option to get the name of the day, date, month, year
    const dayOfWeek = today.toLocaleDateString("en-US", options)
    setCurrentDay(dayOfWeek)
  }, [])

  
  return (
    <div>
      <ScrollToTop />
      <div className={homestyle.heroSection} >
        <ImageSlider imageUrls = {Images} />
      </div>
      <div className={homestyle.mainContainer}>
        <div className={homestyle.headerAndTimeContainer}>
          <div className={homestyle.headerWrapper}>
            <h1>Start Your Journey....</h1>
            <p>Here's what our reviewers recommend this week.</p>
          </div>
          <div className={homestyle.timeWrapper}>
            {currentDay && <p>{currentDay}</p>}
          </div>
        </div>
        <div className={homestyle.weeklybookContainer}>
          {bookOfTheWeek && (
            <div className={homestyle.weeklybookWrapper}>
              <NavLink>
                <img src={`http://localhost:3001/booksimages/${bookOfTheWeek.bookImageUrl}`} alt="Book Image" width="300" height="400" />
              </NavLink>
              <div className={homestyle.bookDiscriptions}>
                <p>Title: <NavLink><span>{bookOfTheWeek.bookTitle}</span></NavLink></p>
                <div className={homestyle.bookAuthorAndRatingsWrapper}>
                  <p>Author: <span>{bookOfTheWeek.bookAuthor}</span></p>
                  {bookOfTheWeek.Ratings}
                </div>
                <div className={homestyle.bookSummeryWrapper}>
                  {bookOfTheWeek && bookOfTheWeek.bookDiscription &&(
                    <NavLink style={{color: "black"}}>
                      <div>
                      {bookOfTheWeek.bookDiscription.split(/\s+/).slice(0, 50).join(' ')}....
                      </div>
                    </NavLink>
                    
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className={homestyle.stafflistWrapper}>
            <h2>STAFF LISTS</h2>
            <div className={homestyle.stafflistBooksContainer}>
              {staffList.length > 0 && (staffList.slice(0, 3).map((elem, id) => (
                <div key={id} className={homestyle.stafflistbookWrapper}>
                  <div>
                    <img src={`http://localhost:3001/booksimages/${elem.bookImageUrl}`} alt="Book Image" width="60" height="80" />
                  </div>
                  <p>{elem.bookTitle}</p>
                </div>
              )))}
            </div>
          </div>
        </div>  
      </div>
      <div className={homestyle.joinSection}>
        <div style={{display:"flex", justifyContent:"center", width:"80%"}}>
          <img src="/HandsDown.jpg" alt="" />
          <div className={homestyle.joinWrapper}>
            <h2>Join the Club</h2>
            <p>Meet your fellow book lover <br /> and get involved in the conversitions.</p>
            <NavLink to="/Register"><button>Let's Chat</button></NavLink>
          </div>
        </div>
        <div style={{display:"flex", alignItems:"center"}}>
          <img src="/Screenshot2.jpg" alt="book picture" width="100%" height="50%" />
        </div>
      </div>
      <div className={homestyle.followUsersContainer}>
        <div className={homestyle.followWrapper}>
          <h2>Follow other users and book reviewers</h2>
          <p>Join a global network of readers and reviewers, fostering connections that transcend borders. Engage in vibrant discussions about your favorite books and topics, forging lasting connections that keep you inspired and informed.</p>
        </div>
        <div className={homestyle.followersExampleWrapper}>
          <div className={homestyle.follower}>
            <div className={homestyle.user}>
              <div className={homestyle.userImageAndName}>
                <img src="/readinginforest.jpg" alt="Profile pic" style={{borderRadius:"50%"}} width="50" height="50" />
              </div>
              <p>John Reed</p>
            </div>
            <div style={{backgroundColor: "#ffe14c", borderRadius:"2rem", width:"5rem", height:"2rem", display:"flex", justifyContent:"center", alignItems:"center", color:"white" }}>Follow</div>
          </div>
          <div className={homestyle.follower}>
            <div className={homestyle.user}>
              <div className={homestyle.userImageAndName}>
                <img src="/fakeuser1.jpg" alt="Profile pic" style={{borderRadius:"50%"}} width="50" height="50" />
              </div>
              <p>Amanda White</p>
            </div>
            <div style={{backgroundColor: "#ffe14c", borderRadius:"2rem", width:"5rem", height:"2rem", display:"flex", justifyContent:"center", alignItems:"center", color:"white"}}>Follow</div>
          </div>
          <div className={homestyle.follower}>
            <div className={homestyle.user}>
              <div className={homestyle.userImageAndName}>
                <img src="/blackgirlreading.jpg" alt="Profile pic" style={{borderRadius:"50%"}} width="50" height="50" />
              </div>
              <p>Khadijah Brown</p>
            </div>
            <div style={{backgroundColor: "#ffe14c", borderRadius:"2rem", width:"5rem", height:"2rem", display:"flex", justifyContent:"center", alignItems:"center", color:"white"}}>Follow</div>
          </div>
        </div>
      </div>

      <div>
        <Fotter />
      </div>
    </div>
  )
}

export default HomeBase
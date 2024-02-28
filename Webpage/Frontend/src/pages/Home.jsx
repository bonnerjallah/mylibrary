import { useEffect, useState } from "react"
import axios from "axios"

import homestyle from "../styles/homestyle.module.css"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowCircleLeft, faArrowCircleRight } from "@fortawesome/free-solid-svg-icons"


import openbrainbook from "/openbrainbook.jpg"
import home from "/home.jpg"
import aman from '/aman.jpg'
import brainbookinhand from "/brainbookinhand.jpg"
import bookpuzzle from "/bookpuzzle.jpg"
import blowbackhead from "/blowbackhead.jpg"

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

const Home = () => {

  const [staffList, setStaffList] = useState([])
  const [staffPicks, setStaffPicks] = useState([])
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

  
  console.log("staff list", staffList)


  //Function to get a random book of the week.
  useEffect(() => {
    const calculateTimeUntilNextSunday = () => {
        const today = new Date();
        const dayOfWeek = today.getDay(); // Sunday is 0, Monday is 1, ..., Saturday is 6
        const daysUntilNextSunday = (7 - dayOfWeek + 0) % 7; // Calculate days until next Sunday
        const millisecondsUntilNextSunday = daysUntilNextSunday * 24 * 60 * 60 * 1000; // Convert days to milliseconds
        return millisecondsUntilNextSunday;
    };

    // Function to select weekly book
    const weeklyBooks = () => {
        const randomNumber = Math.floor(Math.random() * allBooks.length);
        return allBooks[randomNumber];
    };

    // Set book of the week initially
    setBookOfTheWeek(weeklyBooks());

    // Calculate time until next Sunday
    const timeUntilNextSunday = calculateTimeUntilNextSunday();

    // Set up interval to run weeklyBooks every Sunday
    const interval = setInterval(() => {
        setBookOfTheWeek(weeklyBooks());
    }, timeUntilNextSunday);

    // Clear interval on component unmount
    return () => {
        clearInterval(interval);
    };
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


  // console.log(allBooks)
  // console.log("book of the week", bookOfTheWeek)

  

  
  

  
  return (
    <div>
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
              <img src={`http://localhost:3001/booksimages/${bookOfTheWeek.bookImageUrl}`} alt="Book Image" width="300" height="400" />
              <div className={homestyle.bookDiscriptions}>
                <p>Title: <span>{bookOfTheWeek.bookTitle}</span></p>
                <div className={homestyle.bookAuthorAndRatingsWrapper}>
                  <p>Author: <span>{bookOfTheWeek.bookAuthor}</span></p>
                  {bookOfTheWeek.Ratings}
                </div>
                <div className={homestyle.bookSummeryWrapper}>
                  {bookOfTheWeek.bookDiscription}...
                </div>
              </div>
            </div>
          )}
          
          <div className={homestyle.stafflistWrapper}>
            <h2>STAFF LISTS</h2>
            <div className={homestyle.stafflistBooksContainer}>
              {staffList.length > 0 && (staffList.slice(0, 2).map((elem, id) => (
                <div className={homestyle.stafflistbookWrapper}>
                  <div>
                    <img src={`http://localhost:3001/booksimages/${elem.bookImageUrl}`} alt="Book Image" width="100" height="150" />
                  </div>
                  <p>{elem.bookTitle}</p>
                </div>
              )))}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default Home
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import axios from "axios"


import reviewrequeststyle from "../styles/reviewrequeststyle.module.css"


const ReviewerRequest = () => {

    const {id} = useParams()


    const [bioAndBooksRead, setBioAndBooksRead] = useState({
        bio: "",
        avrageread : ""

    })
    const [userAge, setUserAge] = useState({userAge: false});
    const [userid, setUserId] = useState(id)



    const handleRequesInputData = (e, description) => {
        const { name, value, type, checked, number } = e.target;
        if(type === "checkbox") {
            setUserAge((prev) => ({
                ...prev,
                [name]: checked,
                [name + "description"] : checked ? description : "No"
            }))
        } else {
            setBioAndBooksRead((prev) => ({
                ...prev, 
                [name] : value
            }))
        }
    };
    
    


    const handleDataSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append("bioAndBooksRead", bioAndBooksRead.bio);
        formData.append("bioAndBooksRead", bioAndBooksRead.avgBooksRead);
        formData.append("userAgeChecked", userAge.age ? "Yes" : "No");
        formData.append("id", userid);
    
        try {
            const response = await axios.post("http://localhost:3001/usermessage", formData, {
                headers: {"Content-Type": "application/json"}
            });
    
            if (response.status === 200) {
                console.log("successfully inserted user message");
            }
        } catch (error) {
            console.log("Error inserting user message", error);
        }
    };
    
    



    return (
        <div className={reviewrequeststyle.reviewerRequestModal}>
            <div className={reviewrequeststyle.reviewerHeaderWrapper}>
                <h1>Interested in becoming a reviewer?</h1>
                <p>We’d love to hear from you, complete this form and we will review your application</p>
            </div>
            
            <div className={reviewrequeststyle.formContainer}>
                <div style={{margin:"1rem 0"}}>
                    <h2>Submit your details</h2>
                </div>
                <form onSubmit={handleDataSubmit} encType='multipart/form-data' method='POST'>
                    <label htmlFor="Bio"></label>
                    <p>Introduce yourself  <span style={{marginLeft:".5rem", backgroundColor:"lightyellow", padding:"0 .2rem", borderRadius:".2rem"}}>Required</span></p>
                    <textarea name="bio" id="Bio" cols="30" rows="10" placeholder='Write a short bio. Why are you a good fit...' value={bioAndBooksRead.bio} onChange={handleRequesInputData}></textarea>

                    <label htmlFor="booksOnAvrage"></label>
                    <p>How many books on average do you read per year?</p>
                    <input type="number" name='avrageread' id='booksOnAvrage'  onChange={handleRequesInputData}  />

                    <div className={reviewrequeststyle.aggContainer}>
                        <p>Confirm your age <span style={{marginLeft:".5rem", backgroundColor:"lightyellow", padding:"0 .2rem", borderRadius:".2rem"}}>Required</span></p>
                        <div className={reviewrequeststyle.ageWrapper}>
                            <label htmlFor="Age"></label>
                            <input type="checkbox" name='age' id='Age' checked={userAge.age} onChange={(e) => {handleRequesInputData(e, "Yes")}} />
                            <p>I Confirm that I am eighteen (18) years of age or older  </p>
                        </div>
                    </div>
                    

                    <div className={reviewrequeststyle.buttonWrapper}>
                        <button type='submit'>Submit</button>
                    </div>
                </form>
            </div>
            
        </div>
    )
}

export default ReviewerRequest
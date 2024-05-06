import { Star } from "lucide-react"

import ratingstyle from "../styles/ratingstyle.module.css"
import { useState } from "react"

const Rating = ({onRatingChange}) => {

    const [rating, setRating] = useState(null)

    const handleRating = (currentRating) => {
        setRating(currentRating)
        onRatingChange(currentRating); // Call the callback function to update the parent state
        
    }

    return (
        <div className={ratingstyle.mainContainer}>
            {[...Array(5)].map((star, index) => {
                const currentRating = index + 1
                return (
                    <div key={index} className={ratingstyle.ratingWrapper}>
                        <input type="radio" name="rating" value={currentRating} onClick={() => handleRating(currentRating)} />
                        <Star className={ratingstyle.star} fill={currentRating <= rating ? "yellow" : "gray"}/>
                    </div>
                )
            })}
        </div>
    )
}

export default Rating
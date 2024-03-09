import { Star } from "lucide-react"

import ratingstyle from "../styles/ratingstyle.module.css"
import { useState } from "react"

const Rating = () => {

    const [rating, setRating] = useState(null)

    return (
        
        <div className={ratingstyle.mainContainer}>
            {[...Array(5)].map((star, index) => {
                const currentRating = index + 1
                return (
                    <div key={index} className={ratingstyle.ratingWrapper}>
                        <input type="radio" name="rating" value={currentRating} onClick={() => setRating(currentRating)} />
                        <Star className={ratingstyle.star} fill={currentRating <= rating ? "yellow" : "gray"}/>
                    </div>
                )
            })}
        </div>
    )
}

export default Rating
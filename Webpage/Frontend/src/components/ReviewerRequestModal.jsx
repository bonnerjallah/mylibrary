import React from 'react'

const ReviewerRequestModal = ({ memberId, closeModal}) => {

    console.log("member id", memberId)

    return (
        <div style={{border:"2px solid black"}}>
            <div>
                <p  onClick={(e) => {closeModal(false)}}>X</p>
            </div>
            <form action="">
                <label htmlFor=""></label>
                <textarea name="" id="" cols="30" rows="10"></textarea>
            </form>
        </div>
    )
}

export default ReviewerRequestModal
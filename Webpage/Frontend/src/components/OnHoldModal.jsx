import React from 'react'

const OnHoldModal = ({closeModal}) => {
    return (
        <div>
            <p onClick={(e) => {closeModal(false)}} style={{fontSize:'2rem'}}>x</p>
        </div>
    )
}

export default OnHoldModal
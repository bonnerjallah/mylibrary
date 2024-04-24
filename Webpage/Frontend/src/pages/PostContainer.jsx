import React from 'react'

const PostContainer = () => {
    return (
        <div className={socialstyle.socialContainer}>
            <div className={socialstyle.socialSideContainer}>
                <p></p>
                <p>Frinds</p>
                <p>Members</p>
                <p>Saved</p>
                <p>Events</p>
                <p>Messages</p>
            </div>
            <div className={socialstyle.postContainer}>
                <div>
                    following
                </div>

            </div>
            <div>
                <div>
                    <h4>People you may Know</h4>
                    <p>See all</p>
                </div>
                <div>
                    <h4>Contacts</h4>
                    <Search />
                </div>

            </div>
        </div>
    )
}

export default PostContainer
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSearch } from "@fortawesome/free-solid-svg-icons";

import searchbarstyle from "../styles/searchbarstyle.module.css"

const Searchbar = () => {
    return (
        <div className={searchbarstyle.mainContainer}>
            <p> 
                Search the
            </p>
            <label htmlFor="searchWhat"></label>
            <select id="searchWhat">
                <option value="catalog">Catalog</option>
                <option value="events">Events</option>
            </select>
            <p>by</p>
            <label htmlFor="searchBy"></label>
            <select id="searchBy">
                <option value="keyword">Keyword</option>
                <option value="title">Title</option>
                <option value="author">Author</option>
                <option value="subject">Subject</option>
                <option value="user">User</option>
            </select>
            <form>
                <label htmlFor="searchInput"></label>
                <input type="text" name='searchDataInput' id='searchInput' />
                <div style={{display:"flex", alignItems: "center", cursor: "pointer"}}>
                    <FontAwesomeIcon icon={faSearch} />
                </div>
            </form>
        </div>
    )
}

export default Searchbar
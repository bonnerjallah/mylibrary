import { useParams } from "react-router-dom"

const BookDetails = () => {

    const {bookid} = useParams()

    return (
        <div>BookDetails</div>
    )
}

export default BookDetails
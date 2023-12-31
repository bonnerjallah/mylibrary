import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";


import Navbar from "./components/Navbar";

import Home from "./pages/Home"
import AddBook from "./pages/AddBook"
import AddSuggestions from "./pages/AddSuggestions";


const router = createBrowserRouter (
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Navbar />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/AddBook" element={<AddBook />} />
      <Route path="/AddSuggestions" element={<AddSuggestions /> } />
     
    </Route>
  )
)

const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

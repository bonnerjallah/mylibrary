import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";


import Navbar from "./components/Navbar";



import AddBook from "./pages/AddBook"
import AddSuggestions from "./pages/AddSuggestions";
import UserLogin from "./pages/UserLogin";


const router = createBrowserRouter (
  createRoutesFromElements(
    <Route>
      <Route index element={<UserLogin />} />
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

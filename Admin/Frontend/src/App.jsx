import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";


import Navbar from "./components/Navbar";



import AddBook from "./pages/AddBook"
import AddSuggestions from "./pages/AddSuggestions";
import UserLogin from "./pages/UserLogin";
import BooksBorrowedOut from "./pages/BooksBorrowedOut";
import { AuthProvider } from "./components/AuthContext";


const router = createBrowserRouter (
  createRoutesFromElements(
    <Route>
      <Route index element={<UserLogin />} />
      <Route path="/AddBook" element={<AddBook />} />
      <Route path="/AddSuggestions" element={<AddSuggestions /> } />
      <Route path="/BooksBorrowedOut" element={<BooksBorrowedOut /> } />

    </Route>
  )
)

const App = () => {
  return (
    <div>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </div>
  );
}

export default App;

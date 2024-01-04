import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";



import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import AddBook from "./pages/AddBook"
import AddSuggestions from "./pages/AddSuggestions";
import UserLogin from "./pages/UserLogin";
import BooksBorrowedOut from "./pages/BooksBorrowedOut";
import ProtectedRoutes from "./components/ProtectedRoutes";


const router = createBrowserRouter (
  createRoutesFromElements(
    <Route path="/" element={<Navbar /> }>
      <Route path="/" element={<Home /> } />
      <Route path="UserLogin" element={<UserLogin />} />
      <Route element={<ProtectedRoutes />} >
        <Route path="/AddBook" element={<AddBook />} />
        <Route path="/AddSuggestions" element={<AddSuggestions /> } />
        <Route path="/BooksBorrowedOut" element={<BooksBorrowedOut /> } />
      </Route>
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

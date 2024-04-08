import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom"
import { AuthProvider } from "./components/AuthContext"

import Navbar from "./components/Navbar"
import HomeBase from "./pages/HomeBase"
import Ourpicks from "./pages/Ourpicks"
import Discover from "./pages/Discover"
import LoginForm from "./pages/LoginForm"
import Register from "./pages/Register"
import ForgotPassword from "./pages/ForgotPassword"
import Dashboard from "./pages/Dashboard"
import ProtectedRoutes from "./components/ProtectedRoutes"
import ReviewerRequest from "./pages/ReviewerRequest"
import Shelf from "./pages/Shelf"
import CheckOutBooks from "./pages/CheckOutBooks"
import BookDetails from "./pages/BookDetails"
import MessageBoard from "./pages/MessageBoard"


const router = createBrowserRouter (
  createRoutesFromElements(
    <Route path="/" element={<Navbar />}>
      <Route path="/" element={<HomeBase />} />
      <Route path="/LoginForm" element={<LoginForm />} />
      <Route path="/Ourpicks" element={<Ourpicks />} />
      <Route path="/Discover" element={<Discover />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/ForgotPassword" element={<ForgotPassword />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/Dashboard" element={<Dashboard />} /> 
        <Route path="/ReviewerRequest/:id" element={<ReviewerRequest />} />
        <Route path="/Shelf" element={<Shelf /> } />
        <Route path="/CheckOutBooks" element={<CheckOutBooks />} />
        <Route path="/BookDetails/:_id" element={<BookDetails />} />
        <Route path="/MessageBoard" element={<MessageBoard /> } />
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
  )
}

export default App
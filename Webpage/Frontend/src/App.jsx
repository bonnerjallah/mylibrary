import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom"
import { AuthProvider } from "./components/AuthContext"

import Navbar from "./components/Navbar"
import HomeBase from "./pages/HomeBase"
import LoginForm from "./pages/LoginForm"
import Register from "./pages/Register"
import ForgotPassword from "./pages/ForgotPassword"
import Dashboard from "./pages/Dashboard"
import ProtectedRoutes from "./components/ProtectedRoutes"


const router = createBrowserRouter (
  createRoutesFromElements(
    <Route path="/" element={<Navbar />}>
      <Route path="/" element={<HomeBase />} />
      <Route path="/LoginForm" element={<LoginForm />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/ForgotPassword" element={<ForgotPassword />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/Dashboard" element={<Dashboard />} /> 
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
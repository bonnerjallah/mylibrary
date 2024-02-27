import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom"
import { AuthProvider } from "./components/AuthContext"

import Navbar from "./components/Navbar"
import LoginForm from "./pages/LoginForm"
import Home from "./pages/Home"
import Register from "./pages/Register"
import ForgotPassword from "./pages/ForgotPassword"
import Dashboard from "./pages/Dashboard"

const router = createBrowserRouter (
  createRoutesFromElements(
    <Route path="/" element={<Navbar />}>
      <Route path="/Home" element={<Home />} />
      <Route path="/LoginForm" element={<LoginForm />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/ForgotPassword" element={<ForgotPassword />} />
      <Route path="/Dashboard" element={<Dashboard />} />
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
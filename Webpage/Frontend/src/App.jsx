import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom"

import Navbar from "./components/Navbar"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Register from "./pages/Register"
import ForgotPassword from "./pages/ForgotPassword"

const router = createBrowserRouter (
  createRoutesFromElements(
    <Route path="/" element={<Navbar />}>
      <Route path="/Home" element={<Home />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/ForgotPassword" element={<ForgotPassword />} />
    </Route>
  )
)

const App = () => {
  return (
    <div>
        <RouterProvider router={router} />
    </div>
  )
}

export default App
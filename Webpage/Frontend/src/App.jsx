import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom"

import Navbar from "./components/Navbar"
import Home from "./pages/Home"

const router = createBrowserRouter (
  createRoutesFromElements(
    <Route path="/" element={<Navbar />}>
      <Route path="/" element={<Home />} />
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
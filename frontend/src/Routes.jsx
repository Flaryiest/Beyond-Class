import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom"
import Layout from "./Layout"
import UserLayout from "./UserLayout"
import Homepage from "./pages/Homepage"
import Demo from "./pages/Demo"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import Units from "./pages/Units"
import Test from "./pages/Test"
import Answers from "./pages/Answers"
import Schedule from "./pages/Schedule"
import Profile from "./pages/Profile"


function Routes() {
  return createBrowserRouter(
    createRoutesFromElements(<>

      <Route element={<Layout />}>
        <Route path="/" element={<Homepage />} />
        <Route path="demo" element={<Demo/>} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>

      <Route element={<UserLayout />}>
        <Route path="user/:userID" element={<Dashboard/>} />
        <Route path="user/:userID/units" element={<Units />} />
        <Route path="user/:userID/schedule" element={<Schedule />} />
        <Route path="user/:userID/profile" element={<Profile />} />
        <Route path="user/:userID/test/:testID" element={<Test />} />
        <Route path="user/:userID/test/:testID/answers" element={<Answers />} />

      </Route>

      <Route path="*" element={<div>Not Found</div>} />
    </>

    )
  )
}

export default Routes
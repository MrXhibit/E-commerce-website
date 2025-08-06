import React from 'react'
import './User.css'
import { ThemeProvider } from "@mui/material/styles"
import { CssBaseline } from "@mui/material"
import { theme } from "./theme"
import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import Contact from './Contact'
import About from './About'
import Login from './Login'
import Signup from './Signup'

function UserApp() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <div className='user-app'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/about' element={<About />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          {/* Future user routes can be added here */}
        </Routes>
      </div>
    </ThemeProvider>
  )
}

export default UserApp

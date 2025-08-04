import React from 'react'
import './User.css'
import { ThemeProvider } from "@mui/material/styles"
import { CssBaseline } from "@mui/material"
import { theme } from "./theme"
function UserApp() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
     <div className='user-app'>
      <h1>user page</h1>
     </div>
    </ThemeProvider>
  )
}

export default UserApp

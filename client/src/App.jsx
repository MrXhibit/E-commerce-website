import React,{ lazy } from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import './App.css'

const AdminApp = lazy(()=>import('./admin/AdminApp'))
const UserApp = lazy(()=>import('./user/UserApp'))
function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/admin/*' element={<AdminApp/>}/>
      <Route path='/*' element={<UserApp/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App

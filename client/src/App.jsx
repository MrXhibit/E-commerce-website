import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

const AdminApp = lazy(() => import('./admin/AdminApp'))
const UserApp = lazy(() => import('./user/UserApp'))
function App() {

  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path='/admin/*' element={<AdminApp/>}/>
          <Route path='/*' element={<UserApp/>}/>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App

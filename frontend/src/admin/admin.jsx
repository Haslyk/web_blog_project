import React, { Suspense, useEffect } from 'react'
import Navbar from './components/navbar/Navbar'
import Blog from './components/content/Blog'
import Event from './components/content/Event'
import { Routes, Route } from 'react-router-dom';
import Spinner from '../user/component/spinner/Spinner'
import Announcement from './components/content/Announcement';
import {fetchCsrfToken} from './middleware/axios';

const Admin = () => {

useEffect(() => {
  fetchCsrfToken();
}, []);


  return (
    <div style={{width: "100%", height: "100vh", display: "flex"}}>
      <Navbar/>
      <div style={{width: "80%", height: "100vh", overflowY: "scroll"}} className='p-16 pb-8'>
      <Suspense fallback={<Spinner width='40px' height='40px' />}>
          <Routes>
            <Route path='/' element={<Blog />} />
            <Route path='/blogs' element={<Blog/>} />
            <Route path='/events' element={<Event />} />
            <Route path='/announcements' element={<Announcement />} />
            <Route path='*' element={<Blog />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  )
}

export default Admin
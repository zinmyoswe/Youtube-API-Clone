import React, { useState } from 'react';
import Navbar from './Components/Navbar/Navbar';
import './index.css';
import Home from './Pages/Home/Home';
import Video from './Pages/Video/Video';
import Feed from './Components/Feed/Feed';  // Add this import
import { Route, Routes } from 'react-router-dom';
import Shorts from './Components/Shorts/Shorts';


const App = () => {
  const [sidebar, setSidebar] = useState(true);
  
 

  return (
    <div>
      <Navbar setSidebar={setSidebar} />
      <Routes>
        <Route path='/' element={<Home sidebar={sidebar} />} />
        <Route path='/video/:categoryId/:videoId' element={<Video />} />
        <Route path='/feed' element={<Home sidebar={sidebar} />} />
        <Route path='/video/:videoId' element={<Video />} />
        <Route path='/shorts' element={<Shorts />} /> {/* Add this route for Shorts */}
      </Routes>
    </div>
  );
}

export default App;

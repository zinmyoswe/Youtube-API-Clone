import React, { useState } from 'react';
import './Home.css';
import Sidebar from '../../Components/Sidebar/Sidebar';
import Feed from '../../Components/Feed/Feed';

const Home = ({ sidebar }) => {
  const [category, setCategory] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  


  return (
    <>
      <Sidebar sidebar={sidebar} category={category} setCategory={setCategory} />
      <div className={`container ${sidebar ? '' : 'large-container'}`}>
        <Feed category={category} searchResults={searchResults} searchTerm={searchTerm} setSearchResults={setSearchResults} setSearchTerm={setSearchTerm} />
      </div>
    </>
  );
}

export default Home;

import React from 'react';
import search from '../../assets/images/search.svg';
import '../Search/Search.css';

function Search({ setSearchQuery, setSortOption }) {
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <div className='SearchContainer'>
      <div className="search-left">
        <input
          type='text'
          name='search'
          id='search'
          placeholder='search by task name'
          onChange={handleSearchChange}
        />
        <img src={search} alt="search" />
      </div>
      <div>
        Sort by: 
        <select name="select" id="select" onChange={handleSortChange}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>
    </div>
  );
}

export default Search;

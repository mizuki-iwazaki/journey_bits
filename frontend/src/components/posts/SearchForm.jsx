import React, { useState } from 'react';

const SearchForm = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ searchTerm });
  };

  return (
    <div className="flex">
      <form onSubmit={handleSubmit}>
        <div className="flex space-x-2">
          <input
            type="text"
            name="searchTerm"
            className="flex-grow outline-none ring-2 ring-black border border-gray-300 rounded-md py-2 px-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="フリーワード検索"
          />
          <button className="shrink-0 inline-flex text-white bg-custom-turquoise hover:bg-custom-hover-turquoise border-0 py-2 px-6 focus:outline-none rounded text-lg">
            検索
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;

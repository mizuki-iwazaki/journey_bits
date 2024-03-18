import React, { useState, useEffect } from 'react';

const SearchForm = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [themes, setThemes] = useState([]);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/themes`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setThemes(data);
      } catch (error) {
      }
    };

    fetchThemes();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ searchTerm, selectedTheme });
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <select
        className="flex-grow shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="theme"
        value={selectedTheme}
        onChange={(e) => setSelectedTheme(e.target.value)}
      >
        <option value="">テーマを選択</option>
        {themes.map((theme) => (
          <option key={theme.id} value={theme.id}>
            {theme.name}
          </option>
        ))}
      </select>
      <input
        type="text"
        name="searchTerm"
        className="flex-grow outline-none ring-2 ring-black border border-gray-300 rounded-md py-2 px-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="フリーワード検索"
      />
      <button className="font-bold inline-flex justify-center items-center shrink-0 text-white bg-custom-turquoise hover:bg-custom-hover-turquoise border-0 py-2 px-6 focus:outline-none rounded text-lg">
        検索
      </button>
    </form>
  );
};

export default SearchForm;

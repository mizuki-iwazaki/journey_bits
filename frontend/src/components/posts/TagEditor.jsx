import React, { useState } from 'react';

function TagEditor({ tags, setTags, className }) {
  const [input, setInput] = useState('');

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input) {
      if (!tags.includes(input)) {
        setTags([...tags, input]);
        setInput('');
      }
      e.preventDefault();
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className={className}>
      <ul className="flex flex-wrap gap-2">
      {Array.isArray(tags) && tags.map((tag) => (
        <li key={tag} className="bg-blue-200 rounded px-3 py-1 text-sm">
          {tag}
          <button
            onClick={() => removeTag(tag)}
            className="ml-2 text-red-500"
          >
            x
          </button>
        </li>
      ))}
      </ul>
      <input
        type="text"
        id="tags"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="タグを入力して Enter"
        className="mt-2 w-full px-3 py-2 border rounded shadow-sm"
      />
    </div>
  );
}

export default TagEditor;

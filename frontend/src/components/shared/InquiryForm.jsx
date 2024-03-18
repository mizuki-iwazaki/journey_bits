import React, { useState } from 'react';
import axios from 'axios';

function InquiryForm() {
  const [inquiry, setInquiry] = useState({
    name: '',
    email: '',
    content: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInquiry(prevInquiry => ({
      ...prevInquiry,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/inquiries`, {
        inquiry: inquiry
      });
      alert('問い合わせが送信されました。');
      setInquiry({
        name: '',
        email: '',
        content: ''
      });
    } catch (error) {
      alert('問い合わせの送信に失敗しました。');
    }
  };

  return (
    <div className="py-16">
      <div className="form-container mx-auto py-4 px-4 lg:px-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2 text-left">お名前:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={inquiry.name}
              onChange={handleChange}
              required
              autoComplete="name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2 text-left">メールアドレス:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={inquiry.email}
              onChange={handleChange}
              required
              autoComplete="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2 text-left">問い合わせ内容:</label>
            <textarea
              id="content"
              name="content"
              value={inquiry.content}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            ></textarea>
          </div>
          <button className="mr-4 inline-flex text-white bg-custom-turquoise hover:bg-custom-hover-turquoise border-0 py-2 px-6 focus:outline-none rounded text-lg">
            送信
          </button>
        </form>
      </div>
    </div>
  );
}


export default InquiryForm;

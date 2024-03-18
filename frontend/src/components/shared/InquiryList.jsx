import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../user/AuthContext';

function InquiryList() {
  const { token } = useContext(AuthContext);
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    const fetchInquiries = async () => {
      if (token) {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/inquiries`, config);
          let fetchedInquiries = response.data.map(inquiry => ({
            ...inquiry,
            showFullContent: false,
            responded: JSON.parse(localStorage.getItem(`responded-${inquiry.id}`)) || false,
          }));
          setInquiries(fetchedInquiries);
        } catch {
          alert('問い合わせの送信に失敗しました。');
        }
      }
    };

    fetchInquiries();
  }, [token]);

  const toggleContent = id => {
    setInquiries(inquiries.map(inquiry =>
      inquiry.id === id ? { ...inquiry, showFullContent: !inquiry.showFullContent } : inquiry
    ));
  };

  const toggleResponded = id => {
    setInquiries(inquiries.map(inquiry => {
      if (inquiry.id === id) {
        const updatedInquiry = { ...inquiry, responded: !inquiry.responded };
        localStorage.setItem(`responded-${inquiry.id}`, JSON.stringify(updatedInquiry.responded));
        return updatedInquiry;
      }
      return inquiry;
    }));
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  const cellStyle = {
    border: '1px solid #ddd',
    padding: '8px',
  };

  const toggleStyle = {
    cursor: 'pointer',
    color: '#007bff',
    textDecoration: 'underline',
  };

  return (
    <div className="py-16">
      <div className="form-container py-2">
        <h2 className="text-left font-bold text-xl">Inquiries</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={cellStyle}>名前</th>
              <th style={cellStyle}>メールアドレス</th>
              <th style={cellStyle}>本文</th>
              <th style={cellStyle}>送信日</th>
              <th style={cellStyle}>更新日</th>
              <th style={cellStyle}>対応</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map(inquiry => (
              <tr key={inquiry.id}>
                <td style={cellStyle}>{inquiry.name}</td>
                <td style={cellStyle}>{inquiry.email}</td>
                <td style={cellStyle}>
                  {inquiry.content.length > 50 && !inquiry.showFullContent ? (
                    <>
                      {`${inquiry.content.substring(0, 20)}... `}
                      <span style={toggleStyle} onClick={() => toggleContent(inquiry.id)}>もっと見る</span>
                    </>
                  ) : (
                    <>
                      {inquiry.content} {inquiry.content.length > 20 && <span style={toggleStyle} onClick={() => toggleContent(inquiry.id)}>隠す</span>}
                    </>
                  )}
                </td>
                <td style={cellStyle}>{new Date(inquiry.created_at).toLocaleString()}</td>
                <td style={cellStyle}>{new Date(inquiry.updated_at).toLocaleString()}</td>
                <td style={cellStyle}>
                  <input
                    type="checkbox"
                    id={`responded-${inquiry.id}`}
                    name={`responded-${inquiry.id}`}
                    checked={inquiry.responded}
                    onChange={() => toggleResponded(inquiry.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InquiryList;

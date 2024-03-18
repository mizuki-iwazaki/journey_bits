import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { securityQuestions } from './SecurityQuestions';

export default function PasswordResetRequest() {
  const [email, setEmail] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/password_resets/validate`, {
        email: email,
        security_question: selectedQuestion,
        security_answer: securityAnswer,
      });
      if (response.status === 200) {
        navigate('/password-reset', { state: { userId: response.data.user_id }});
      } else {
        alert('提供された情報が一致しません。');
      }
    } catch {
      alert('入力した項目を確認してください。');
    }
  };

  return (
    <div className="max-w-md mx-auto py-16">
      <h2 className="text-lg mb-4">パスワードリセットのリクエスト</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="emailInput" className="block text-sm font-bold text-gray-700 mb-1 text-left">Email</label>
          <input
            id="emailInput"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Emailを入力してください"
            required
            autoComplete="email"
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="securityQuestion" className="block text-sm font-bold text-gray-700 mb-1 text-left">秘密の質問</label>
          <select
            id="securityQuestion"
            name="security_question"
            value={selectedQuestion}
            onChange={(e) => setSelectedQuestion(e.target.value)}
            required
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">質問を選択してください</option>
            {securityQuestions.map((question) => (
              <option key={question.value} value={question.value}>
                {question.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="securityAnswerInput" className="block text-sm font-bold text-gray-700 mb-1 text-left">秘密の質問の回答</label>
          <input
            id="securityAnswerInput"
            name="security_answer"
            type="text"
            value={securityAnswer}
            onChange={(e) => setSecurityAnswer(e.target.value)}
            placeholder="秘密の質問の回答"
            required
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-custom-turquoise hover:bg-custom-hover-turquoise focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          送信
        </button>
      </form>
    </div>
  );
}

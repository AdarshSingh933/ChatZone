import './App.css';
import React, { useState } from 'react';

const ChatApp = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [likes, setLikes] = useState({});

  const userList = ["Alan", "Bob", "Carol", "Dean", "Elin"];

  const handleSendMessage = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    
    if (message.trim() === '') return;
    
    const randomUser = userList[Math.floor(Math.random() * userList.length)];
    const newMessage = {
      user: randomUser,
      text: message,
      likes: 0
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
  };

  const handleLike = (index) => {
    const newLikes = { ...likes };
    newLikes[index] = (newLikes[index] || 0) + 1;
    setLikes(newLikes);
  };

  return (
    <div>
      <div className='chat-container'>
        {messages.map((msg, index) => (
          <div key={index} style={{ margin: '10px 0', display: 'flex', alignItems: 'center' }}>
            <div className='short-name'>
              {msg.user[0]} {/* Display only the initial letter of the user's name */}
            </div>
            <div style={{ marginRight: '10px', marginBottom: '5px' }}>
              <div style={{ fontWeight: 'bold', color: '#075e54' }}>
                {msg.user}
              </div>
              <div style={{ backgroundColor: '#dcf8c6', padding: '8px', borderRadius: '8px' }}>
                {msg.text}
              </div>
            </div>
            <button onClick={() => handleLike(index)}>
              <img src='https://cdn-icons-png.flaticon.com/128/889/889140.png' alt='like icon' style={{ height:'22px',width:'22px' }}></img>{likes[index] || 0}
            </button>
          </div>
        ))}
      </div>
      <div className='chat-box'>
        <form onSubmit={handleSendMessage} > {/* Form wrapper */}
          <input 
            type="text" 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            placeholder="Type your message..."
          />
        </form>
      </div>
    </div>
  );
};

export default ChatApp;
import './App.css';
import React, { useEffect, useState } from 'react';
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");

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
    
    // Emit the entire messages array to the server
    socket.emit("send_message", { messages: [...messages, newMessage] });

    // No need to update local state here as the message will be received from the server
    setMessage('');
  };

  const handleLike = (index) => {
    // Increment the like count for the specific message index
    const updatedLikes = { ...likes };
    updatedLikes[index] = (updatedLikes[index] || 0) + 1;
    
    // Emit the updated like count to the server
    socket.emit("send_likes", { index, likes: updatedLikes[index] });
    
  };
  
  
  useEffect(() => {
    socket.on("receive_message", (data) => {
      // Ensure data.messages is always an array before updating the local state
      if (Array.isArray(data.messages)) {
        setMessages(data.messages);
      }
    });
    socket.on("receive_likes", (data) => {
      // Update the local state with the received likes
      setLikes((prevLikes) => ({
        ...prevLikes,
        [data.index]: data.likes // Update the specific like count for the given index
      }));
    });
  

    // Add error handling for socket connection and data receiving
    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });
    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  }, []);

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
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default ChatApp;

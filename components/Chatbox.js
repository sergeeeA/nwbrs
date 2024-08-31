import { useState, useEffect, useRef } from 'react';
import chatboxStyle from '../styles/Chatbox.module.css';

export default function Chatbox() {
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('messages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null); // Ref for scrolling to the bottom

  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    // Scroll to the bottom of the messages container when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      const newMessage = { text: input, id: Date.now() };
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, newMessage];
        if (updatedMessages.length > 20) {
          updatedMessages.shift(); // Remove the oldest message
        }
        return updatedMessages;
      });
      setInput(''); // Clear the input field
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={chatboxStyle.chatbox}>
      <div className={chatboxStyle.messages}>
        {messages.map(msg => (
          <div key={msg.id} className={chatboxStyle.message}>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* Empty div to act as scroll target */}
      </div>
      <div className={chatboxStyle.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className={chatboxStyle.input}
          placeholder=""
        />

      </div>
      <button onClick={handleSend} className={chatboxStyle.sendButton}>
          SEND
        </button>
    </div>
  );
}

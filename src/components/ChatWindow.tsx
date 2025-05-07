"use client";

import React, { useState } from 'react';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      setMessages([
        ...messages,
        { text: newMessage, sender: 'user' },
        // Simulate a bot reply or integrate with an AI service here
        // For now, we'll add an empty bot message as a placeholder
        { text: '...', sender: 'bot' }, 
      ]);
      setNewMessage('');
    }
  };

  return (
    <div className="chat-window flex flex-col h-96 border border-border rounded-lg shadow-md bg-card">
      <div className="messages-container flex-grow overflow-y-auto p-4 space-y-2">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message p-3 rounded-lg max-w-[70%] ${
              message.sender === 'user' 
                ? 'user-message bg-primary text-primary-foreground self-end ml-auto' 
                : 'bot-message bg-muted text-muted-foreground self-start mr-auto'
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-area flex p-3 border-t border-border">
        <input
          type="text"
          className="message-input flex-grow p-2 border border-input rounded-l-md focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button 
          className="send-button bg-primary text-primary-foreground px-4 py-2 rounded-r-md hover:bg-primary/90 transition-colors" 
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;

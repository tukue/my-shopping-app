import React, { useState, useEffect } from 'react';
import { LexRuntimeV2 } from 'aws-sdk';
import './ChatBot.css';

// Separate config setup
const lexConfig = {
  region: process.env.REACT_APP_AWS_REGION,
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
  }
};

// Validate environment variables
const validateEnvVariables = () => {
  const requiredEnvVars = [
    'REACT_APP_AWS_REGION',
    'REACT_APP_AWS_ACCESS_KEY_ID',
    'REACT_APP_AWS_SECRET_ACCESS_KEY',
    'REACT_APP_BOT_ID',
    'REACT_APP_BOT_ALIAS_ID'
  ];

  const missingVars = requiredEnvVars.filter(
    varName => !process.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
};

export default function ChatBot() {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lexClient, setLexClient] = useState(null);

  // Initialize Lex client using useEffect
  useEffect(() => {
    try {
      validateEnvVariables();
      const client = new LexRuntimeV2(lexConfig);
      setLexClient(client);
    } catch (err) {
      console.error('Configuration error:', err);
      setError('ChatBot configuration error');
    }
  }, []);

  const sendMessageToLex = async (message) => {
    if (!lexClient) {
      throw new Error('Lex client not initialized');
    }

    const params = {
      botId: process.env.REACT_APP_BOT_ID,
      botAliasId: process.env.REACT_APP_BOT_ALIAS_ID,
      localeId: 'en_US',
      sessionId: `session-${Date.now()}`,
      text: message
    };

    try {
      const response = await lexClient.recognizeText(params).promise();
      return response.messages;
    } catch (err) {
      console.error('Error communicating with Lex:', err);
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedInput = userInput.trim();
    if (!trimmedInput) return;

    setIsLoading(true);
    setError(null);

    try {
      // Add user message to chat
      const newUserMessage = {
        type: 'user',
        content: trimmedInput,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, newUserMessage]);
      setUserInput(''); // Clear input immediately after sending

      // Get bot response
      const lexResponse = await sendMessageToLex(trimmedInput);

      // Add bot responses to chat
      if (lexResponse && lexResponse.length > 0) {
        const botMessages = lexResponse.map(message => ({
          type: 'bot',
          content: message.content,
          timestamp: new Date()
        }));

        setMessages(prev => [...prev, ...botMessages]);
      } else {
        throw new Error('No response from chatbot');
      }
    } catch (err) {
      setError('Failed to get response from chatbot');
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          {error}
          <button 
            onClick={() => setError(null)}
            className="error-dismiss"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="chatbot-container">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div 
            key={`${message.type}-${index}-${message.timestamp.getTime()}`}
            className={`message ${message.type}`}
          >
            <div className="message-content">{message.content}</div>
            <div className="message-timestamp">
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading || !lexClient}
          className="chat-input"
        />
        <button 
          type="submit" 
          disabled={isLoading || !lexClient || !userInput.trim()}
          className="chat-submit-button"
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}

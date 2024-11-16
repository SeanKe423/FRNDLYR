import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './Chat.css';

const Chat = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [chat, setChat] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const fetchChat = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                console.log('Fetching chat for userId:', userId);
                const response = await axios.get(
                    `http://localhost:5000/api/chat/chat/${userId}`,
                    {
                        headers: { 
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                console.log('Chat response:', response.data);
                setChat(response.data);
                setLoading(false);
                setError(null);
            } catch (error) {
                console.error('Error fetching chat:', error.response || error);
                setError('Unable to load chat. Please try again.');
                setLoading(false);
            }
        };

        fetchChat();
        const interval = setInterval(fetchChat, 3000);
        return () => clearInterval(interval);
    }, [userId, navigate]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        try {
            const token = localStorage.getItem('token');
            if (!chat?._id) {
                throw new Error('Chat not initialized');
            }

            const response = await axios.post(
                `http://localhost:5000/api/chat/chat/${chat._id}/message`,
                { content: message },
                { 
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Message sent:', response.data);
            setMessage('');
            setChat(prev => ({
                ...prev,
                messages: [...prev.messages, response.data]
            }));
        } catch (error) {
            console.error('Error sending message:', error);
            setError('Failed to send message. Please try again.');
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [chat?.messages]);

    if (loading) return <div className="chat-loading">Loading chat...</div>;
    if (error) return <div className="chat-error">{error}</div>;

    return (
        <div className="chat-container">
            <div className="chat-header">
                <button onClick={() => navigate('/matches')} className="back-button">
                    ← Back
                </button>
                <h2>{chat?.participants.find(p => p._id !== userId)?.username}</h2>
            </div>
            
            <div className="messages-container">
                {chat?.messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message ${msg.sender._id === userId ? 'received' : 'sent'}`}
                    >
                        <div className="message-content">{msg.content}</div>
                        <div className="message-timestamp">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="message-form">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="message-input"
                />
                <button type="submit" className="send-button">Send</button>
            </form>
        </div>
    );
};

export default Chat; 
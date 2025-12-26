import { useState, useRef, useEffect } from 'react';
import chatIcon from "./assets/comment-solid-full.svg";
import "./chatbot.css"
import { formatText } from './formatter';

export default function Chatbot({isOpen,setIsOpen,unique_note_id}) {
    
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hi! I'm your AI assistant. I have access to this note; please let me know what questions you have." }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        let current_messages = messages
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch('https://ai-backend-dazz.onrender.com/api/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    unique_note_id: unique_note_id,
                    query: userMessage,
                    past_conversations: current_messages
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const data = await response.json();
            console.log(data)
            setMessages(prev => [...prev, { role: 'assistant', content: formatText(data.response) }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            <div className={`chatbot-panel ${isOpen ? 'open' : ''}`}>
                <div className="chatbot-header">
                    <div className="chatbot-header-content">
                        <div className="chatbot-avatar">
                            <img src={chatIcon} alt="" />
                        </div>
                        <div className="chatbot-title">
                            <h3>Chat Engine</h3>
                            <span className="chatbot-status">gpt-oss-20b</span>
                        </div>
                    </div>
                    <div className='backBtnBox'>
                        <button onClick={()=>setIsOpen(false)}>close</button>
                    </div>
                </div>

                <div className="chatbot-messages">

                    {messages.map((msg, idx) => (
                        <div key={idx} className={`message ${msg.role}`}>
                            <div className="message-content" dangerouslySetInnerHTML={{ __html: msg.content }}>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="message assistant">
                            <div className="message-content">
                                <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="chatbot-input-container">
                    <textarea
                        ref={inputRef}
                        className="chatbot-input"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        rows="1"
                    />
                    <button
                        className="chatbot-send"
                        onClick={sendMessage}
                        disabled={!input.trim() || isLoading}
                        aria-label="Send message"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </div>
            </div>
        </>
    );
}
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage, Tool } from '../types';
import { createChatSession, sendMessageToGemini } from '../services/geminiService';

interface AiChatProps {
  tools: Tool[];
}

export const AiChat: React.FC<AiChatProps> = ({ tools }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Привет! Я знаю всё об инструментах в этом списке. Спрашивай, помогу подобрать нужное!' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Persist chat session
  const chatSessionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !chatSessionRef.current && tools.length > 0) {
       chatSessionRef.current = createChatSession(tools);
    }
  }, [isOpen, tools]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    if (!chatSessionRef.current) {
       // Re-init if lost or first load failed
       chatSessionRef.current = createChatSession(tools);
    }

    const response = await sendMessageToGemini(chatSessionRef.current, userMsg);
    
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-2xl flex items-center gap-2 transition-all duration-300 ${isOpen ? 'opacity-0 pointer-events-none' : 'bg-brand-600 text-white hover:bg-brand-500'}`}
      >
        <Sparkles size={24} />
        <span className="font-semibold hidden sm:inline">AI Помощник</span>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-[90vw] sm:w-96 h-[600px] max-h-[80vh] bg-dark-800 border border-dark-600 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-brand-600 to-purple-600 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2 text-white">
                <Bot size={20} />
                <h3 className="font-bold">AI Ассистент</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-dark-900/50">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-dark-700' : 'bg-brand-600'}`}>
                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div 
                    className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user' 
                        ? 'bg-dark-700 text-white rounded-tr-none' 
                        : 'bg-dark-800 border border-dark-700 text-gray-200 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                   <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center shrink-0">
                    <Bot size={14} />
                  </div>
                  <div className="bg-dark-800 border border-dark-700 p-3 rounded-2xl rounded-tl-none">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}/>
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}/>
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}/>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-dark-800 border-t border-dark-700 shrink-0">
              <div className="flex items-center gap-2 bg-dark-900 rounded-xl border border-dark-700 px-3 py-2 focus-within:border-brand-500 transition-colors">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Спроси что-нибудь..."
                  className="flex-1 bg-transparent outline-none text-white text-sm placeholder-gray-500"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !inputValue.trim()}
                  className="p-2 rounded-lg bg-brand-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-500 transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
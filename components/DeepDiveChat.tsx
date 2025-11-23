
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateChatResponse } from '../services/geminiService';

interface Props {
  artistName: string;
}

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  topic?: string;
  timestamp: number;
}

const CHIPS = [
  { id: 'institution', label: 'INSTITUTION' },
  { id: 'discourse', label: 'DISCOURSE' },
  { id: 'academy', label: 'ACADEMY' },
  { id: 'network', label: 'NETWORK' },
  { id: 'market', label: 'MARKET VALUE' }
];

export const DeepDiveChat: React.FC<Props> = ({ artistName }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const storageKey = `chat_history_${artistName.replace(/\s/g, '_')}`;

  // Load history
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load chat history");
      }
    } else {
        setMessages([]); // Reset if no history for this artist
    }
  }, [artistName, storageKey]);

  // Save history
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, storageKey]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Unified message sender
  const processUserMessage = async (text: string, topic?: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { 
      id: Date.now().toString(), 
      role: 'user', 
      text: text, 
      topic: topic,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputValue(''); // Clear input if it was used
    setLoading(true);

    try {
      // If topic is present, use it for context, otherwise treat as general query
      const responseText = await generateChatResponse(artistName, topic || text);
      
      const aiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'ai', 
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      // Refocus input after turn
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleChipClick = (chip: {id: string, label: string}) => {
    processUserMessage(`Tell me about ${artistName}'s ${chip.label.toLowerCase()}.`, chip.label);
  };

  const handleInputSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    processUserMessage(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleInputSubmit();
    }
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem(storageKey);
  };

  return (
    <div className="fixed bottom-0 left-0 w-full md:w-[calc(100%-280px)] z-40 p-6 md:p-8 pointer-events-none flex flex-col justify-end h-[75vh]">
      <div className="w-full max-w-2xl mx-auto pointer-events-auto flex flex-col h-full relative">
        
        {/* Header / Clear */}
        {messages.length > 0 && (
            <div className="absolute top-0 right-0 z-10">
                <button 
                  onClick={clearHistory} 
                  className="text-[8px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors bg-white/90 backdrop-blur px-3 py-1 rounded border border-gray-200 shadow-sm"
                  aria-label="Clear chat history"
                >
                    Clear History
                </button>
            </div>
        )}

        {/* Messages Area */}
        <div 
          className="flex-grow overflow-y-auto custom-scrollbar space-y-6 pr-2 mb-4 pb-4 mask-image-gradient pt-8" 
          style={{ scrollBehavior: 'smooth' }}
          role="log"
          aria-label="Chat messages"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`
                  relative max-w-[80%] p-5 shadow-sm backdrop-blur-sm
                  ${msg.role === 'user' 
                    ? 'bg-[#0a0a0a] text-white rounded-2xl rounded-br-none border border-gray-800' 
                    : 'bg-white border border-gray-200 text-black rounded-2xl rounded-tl-none'}
                `}>
                  {msg.role === 'ai' && (
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#28317C] block mb-2 border-b border-gray-100 pb-1 w-fit">
                      Curator AI
                    </span>
                  )}
                  <p className={`text-sm leading-relaxed ${msg.role === 'ai' ? 'font-serif' : 'font-sans font-light tracking-wide'}`}>
                    {msg.text}
                  </p>
                  <span className={`text-[8px] block mt-2 text-right font-mono uppercase tracking-wider ${msg.role === 'user' ? 'text-gray-500' : 'text-gray-400'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {loading && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-sm">
                   <span className="w-1.5 h-1.5 bg-[#28317C] rounded-full animate-bounce"></span>
                   <span className="w-1.5 h-1.5 bg-[#28317C] rounded-full animate-bounce delay-100"></span>
                   <span className="w-1.5 h-1.5 bg-[#28317C] rounded-full animate-bounce delay-200"></span>
                </div>
             </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Control Panel: Chips + Input */}
        <div className="bg-white/90 backdrop-blur-xl border border-gray-200 p-3 rounded-3xl shadow-2xl flex flex-col gap-3">
           
           {/* Row 1: Chips */}
           <div className="flex gap-2 overflow-x-auto no-scrollbar w-full items-center pb-1 border-b border-gray-100/50">
              <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400 mr-1 whitespace-nowrap pl-2">Topics:</span>
              {CHIPS.map(chip => (
                 <button
                   key={chip.id}
                   onClick={() => handleChipClick(chip)}
                   disabled={loading}
                   tabIndex={0}
                   className="flex-shrink-0 px-3 py-1.5 rounded-full border border-gray-200 bg-white text-[9px] font-bold uppercase tracking-widest text-gray-600 hover:bg-[#28317C] hover:text-white hover:border-[#28317C] transition-all disabled:opacity-50 active:scale-95 focus:outline-none focus:ring-1 focus:ring-[#28317C]"
                 >
                    {chip.label}
                 </button>
              ))}
           </div>

           {/* Row 2: Input */}
           <div className="flex items-center gap-2 pl-2 pr-1">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                placeholder="Ask specific questions..."
                className="flex-grow bg-transparent text-sm font-sans placeholder-gray-400 text-black focus:outline-none disabled:opacity-50"
                aria-label="Type your question"
              />
              <button 
                onClick={() => handleInputSubmit()}
                disabled={!inputValue.trim() || loading}
                className="w-8 h-8 flex-shrink-0 bg-[#28317C] rounded-full flex items-center justify-center text-white shadow-md hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#28317C]"
                aria-label="Send message"
              >
                 <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 12h14M12 5l7 7-7 7" />
                 </svg>
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};

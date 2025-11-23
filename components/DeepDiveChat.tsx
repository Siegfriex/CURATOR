
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
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

  const handleChipClick = async (chip: {id: string, label: string}) => {
    const userMsg: Message = { 
      id: Date.now().toString(), 
      role: 'user', 
      text: `Tell me about ${artistName}'s ${chip.label.toLowerCase()}.`, 
      topic: chip.id,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const responseText = await generateChatResponse(artistName, chip.label);
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
    }
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem(storageKey);
  };

  return (
    <div className="fixed bottom-0 left-0 w-full md:w-[calc(100%-280px)] z-40 p-6 md:p-8 pointer-events-none flex flex-col justify-end h-[65vh]">
      <div className="w-full max-w-2xl mx-auto pointer-events-auto flex flex-col h-full">
        
        {/* Header / Clear */}
        {messages.length > 0 && (
            <div className="flex justify-end mb-2 pr-2">
                <button onClick={clearHistory} className="text-[8px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors bg-white/80 backdrop-blur px-2 py-1 rounded">
                    Clear History
                </button>
            </div>
        )}

        {/* Messages Area */}
        <div className="flex-grow overflow-y-auto custom-scrollbar space-y-6 pr-2 mb-6 pb-4 mask-image-gradient" style={{ scrollBehavior: 'smooth' }}>
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

        {/* Input / Chips Row */}
        <div className="bg-white/90 backdrop-blur-xl border border-gray-200 p-2.5 rounded-full shadow-2xl flex items-center justify-between gap-4">
           <div className="flex gap-2 overflow-x-auto no-scrollbar px-2 w-full items-center">
              <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mr-2 whitespace-nowrap">Inquire:</span>
              {CHIPS.map(chip => (
                 <button
                   key={chip.id}
                   onClick={() => handleChipClick(chip)}
                   disabled={loading}
                   className="flex-shrink-0 px-4 py-2 rounded-full border border-gray-200 bg-white text-[9px] font-bold uppercase tracking-widest text-gray-600 hover:bg-[#28317C] hover:text-white hover:border-[#28317C] transition-all disabled:opacity-50 active:scale-95"
                 >
                    {chip.label}
                 </button>
              ))}
           </div>
           <div className="w-10 h-10 flex-shrink-0 bg-[#28317C] rounded-full flex items-center justify-center text-white shadow-lg">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
           </div>
        </div>

      </div>
    </div>
  );
};

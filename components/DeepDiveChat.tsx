
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateChatResponse } from '../services/geminiService';
import { NauticalSpinner } from '../App';

interface Props {
  artistName: string;
}

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  topic?: string;
}

const CHIPS = [
  { id: 'institution', label: '제도 (Institution)' },
  { id: 'discourse', label: '담론 (Discourse)' },
  { id: 'academy', label: '학술 (Academy)' },
  { id: 'network', label: '네트워크 (Network)' },
  { id: 'artworks', label: '작품 (Artworks)' }
];

export const DeepDiveChat: React.FC<Props> = ({ artistName }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleChipClick = async (chip: {id: string, label: string}) => {
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: chip.label, topic: chip.id };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const responseText = await generateChatResponse(artistName, chip.label);
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'ai', text: responseText };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed bottom-20 md:bottom-0 left-0 w-full md:w-[calc(100%-280px)] z-40 p-6 md:p-12 pointer-events-none"
    >
      <div className="max-w-3xl pointer-events-auto">
        
        {/* Chat Area */}
        <div className="mb-6 md:mb-8 space-y-4 max-h-[35vh] md:max-h-[40vh] overflow-y-auto custom-scrollbar pr-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`
                  max-w-[80%] p-4 backdrop-blur-md border 
                  ${msg.role === 'user' 
                    ? 'bg-white/10 border-white/20 text-white rounded-2xl rounded-br-none' 
                    : 'bg-black/40 border-white/10 text-gray-200 rounded-2xl rounded-tl-none'}
                `}>
                  {msg.role === 'ai' && <span className="text-[8px] uppercase tracking-widest text-[#3B82F6] block mb-2">AI Analyst</span>}
                  <p className="text-xs md:text-sm font-light leading-relaxed">{msg.text}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
             <div className="flex justify-start">
                <div className="bg-black/40 border border-white/10 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                   <div className="w-2 h-2 bg-[#3B82F6] rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-[#3B82F6] rounded-full animate-bounce delay-75"></div>
                   <div className="w-2 h-2 bg-[#3B82F6] rounded-full animate-bounce delay-150"></div>
                </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area / Chips */}
        <div className="glassmorphism-input bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-2 pl-4 md:pl-6 flex items-center justify-between shadow-2xl">
           <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {CHIPS.map(chip => (
                 <button
                   key={chip.id}
                   onClick={() => handleChipClick(chip)}
                   disabled={loading}
                   className="px-3 py-2 md:px-4 md:py-2 rounded-full border border-white/20 text-[10px] md:text-xs text-white hover:bg-white hover:text-black transition-colors whitespace-nowrap disabled:opacity-50"
                 >
                    {chip.label}
                 </button>
              ))}
           </div>
           <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-[#3B82F6] ml-2 md:ml-4 flex-shrink-0">
              <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
           </div>
        </div>

      </div>
    </motion.div>
  );
};

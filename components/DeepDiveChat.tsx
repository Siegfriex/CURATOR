
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateChatResponse } from '../services/geminiService';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

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
  const [isHovered, setIsHovered] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load history from Firestore
  useEffect(() => {
    // Use a simpler query that doesn't require composite index
    // First get all messages for the artist, then sort client-side
    const q = query(
      collection(db, 'chats'),
      where('artistName', '==', artistName)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages: Message[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          role: data.role as 'user' | 'ai',
          text: data.text,
          topic: data.topic || undefined,
          timestamp: data.timestamp?.toMillis?.() || data.timestamp || Date.now()
        };
      });
      // Sort by timestamp client-side
      loadedMessages.sort((a, b) => a.timestamp - b.timestamp);
      setMessages(loadedMessages);
    }, (error) => {
      console.error("Error loading chat history:", error);
    });
    
    return () => unsubscribe();
  }, [artistName]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, isHovered]);

  const processUserMessage = async (text: string, topic?: string) => {
    if (!text.trim() || loading) return;

    setInputValue('');
    setLoading(true);

    try {
      // Save user message to Firestore
      const messageData: any = {
        artistName,
        role: 'user',
        text: text,
        timestamp: serverTimestamp()
      };
      // Only add topic if it exists
      if (topic) {
        messageData.topic = topic;
      }
      await addDoc(collection(db, 'chats'), messageData);

      const responseText = await generateChatResponse(artistName, topic || text);
      
      // Save AI response to Firestore
      await addDoc(collection(db, 'chats'), {
        artistName,
        role: 'ai',
        text: responseText,
        timestamp: serverTimestamp()
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
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

  const clearHistory = async () => {
    try {
      const q = query(
        collection(db, 'chats'),
        where('artistName', '==', artistName)
      );
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    } catch (e) {
      console.error("Error clearing chat history:", e);
    }
  };

  return (
    <div 
      className="fixed bottom-0 left-0 w-full md:w-[calc(100%-280px)] z-40 px-4 md:px-8 pb-4 md:pb-8 flex flex-col justify-end pointer-events-none transition-transform duration-500 ease-in-out"
      style={{ 
        height: '85vh',
        transform: isHovered || loading || messages.length > 0 ? 'translateY(0)' : 'translateY(calc(100% - 80px))'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Container - Glassmorphism Card */}
      <div className="w-full max-w-3xl mx-auto pointer-events-auto flex flex-col h-full relative bg-white/80 backdrop-blur-2xl border border-white/40 rounded-t-3xl shadow-[0_-20px_60px_rgba(0,0,0,0.15)] overflow-hidden transition-all duration-300">
        
        {/* Handle / Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/5 bg-white/40 cursor-pointer">
            <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-2.5 h-2.5 bg-[#28317C] rounded-full"></div>
                  <div className="absolute inset-0 bg-[#28317C] rounded-full animate-ping opacity-20"></div>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#28317C] block">AI Curator</span>
                  <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest hidden md:block">Interactive Analysis Engine</span>
                </div>
            </div>
            {messages.length > 0 && (
                <button 
                  onClick={(e) => { e.stopPropagation(); clearHistory(); }}
                  className="text-[8px] uppercase tracking-widest text-gray-400 hover:text-red-600 transition-colors border border-transparent hover:border-red-100 px-2 py-1 rounded"
                >
                    Reset
                </button>
            )}
        </div>

        {/* Messages Area */}
        <div 
          className="flex-grow overflow-y-auto custom-scrollbar p-6 space-y-8 bg-gradient-to-b from-white/60 to-white/30" 
          role="log"
          aria-label="Chat messages"
        >
          {messages.length === 0 && (
             <div className="flex flex-col items-center justify-center h-full opacity-50">
                <div className="w-16 h-16 border border-gray-300 rounded-full flex items-center justify-center mb-6">
                   <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </div>
                <span className="font-serif text-3xl italic text-gray-400 mb-3">Start the Dialogue</span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400">Select a topic below to begin analysis</span>
             </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`
                  flex flex-col max-w-[85%] md:max-w-[75%]
                  ${msg.role === 'user' ? 'items-end' : 'items-start'}
                `}>
                  <div className={`
                    p-5 shadow-sm relative group
                    ${msg.role === 'user' 
                      ? 'bg-[#1a1a1a] text-white rounded-2xl rounded-br-sm' 
                      : 'bg-white border border-black/10 text-black rounded-2xl rounded-tl-sm'}
                  `}>
                    {msg.role === 'ai' && (
                      <span className="text-[8px] font-bold uppercase tracking-widest text-[#28317C] mb-2 block opacity-60">
                        Curator Response
                      </span>
                    )}
                    <p className={`text-sm md:text-base leading-relaxed ${msg.role === 'ai' ? 'font-serif text-gray-800' : 'font-sans font-light tracking-wide text-gray-100'}`}>
                      {msg.text}
                    </p>
                  </div>
                  <span className="text-[9px] text-gray-400 mt-2 px-1 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {loading && (
             <div className="flex justify-start">
                <div className="bg-white border border-black/5 p-5 rounded-2xl rounded-tl-sm flex items-center gap-2 shadow-sm">
                   <span className="text-[8px] uppercase tracking-widest text-gray-400 mr-2">Thinking</span>
                   <span className="w-1.5 h-1.5 bg-[#28317C] rounded-full animate-bounce"></span>
                   <span className="w-1.5 h-1.5 bg-[#28317C] rounded-full animate-bounce delay-75"></span>
                   <span className="w-1.5 h-1.5 bg-[#28317C] rounded-full animate-bounce delay-150"></span>
                </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white/60 border-t border-black/5 p-4 backdrop-blur-sm">
           {/* Chips */}
           <div className="flex gap-2 overflow-x-auto no-scrollbar w-full items-center mb-4 pb-1 mask-linear-fade">
              {CHIPS.map(chip => (
                 <button
                   key={chip.id}
                   onClick={() => handleChipClick(chip)}
                   disabled={loading}
                   className="flex-shrink-0 px-4 py-2 rounded-full border border-black/10 bg-white text-[9px] font-bold uppercase tracking-widest text-gray-600 hover:bg-[#28317C] hover:text-white hover:border-[#28317C] transition-all disabled:opacity-50 active:scale-95 shadow-sm"
                 >
                    {chip.label}
                 </button>
              ))}
           </div>

           {/* Text Field */}
           <div className="flex items-center gap-3 bg-white rounded-full px-5 py-3 border border-black/10 focus-within:border-[#28317C] focus-within:ring-1 focus-within:ring-[#28317C]/20 transition-all shadow-sm">
              <input
                id="chat-input"
                name="chat-input"
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                placeholder="Ask for specific insights..."
                className="flex-grow bg-transparent text-sm font-sans placeholder-gray-400 text-black focus:outline-none disabled:opacity-50"
              />
              <button 
                onClick={() => handleInputSubmit()}
                disabled={!inputValue.trim() || loading}
                className="w-8 h-8 flex-shrink-0 bg-[#28317C] rounded-full flex items-center justify-center text-white hover:scale-110 hover:shadow-lg transition-all disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
              >
                 {loading ? (
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                 ) : (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                 )}
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { SparklesIcon, PaperAirplaneIcon } from './icons';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const AITripPlanner: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add a welcome message from the AI on initial load
    setMessages([
        { sender: 'ai', text: 'Muraho! Ndi umufasha wawe w\'ingendo. Nshobora kugufasha gutegura urugendo rwawe. Baza ikibazo, urugero: "Nsobanurira urugendo rwiza rwa wikendi ruva i Kigali?"' }
    ]);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!prompt.trim() || loading) return;

    const userMessage: Message = { sender: 'user', text: prompt };
    setMessages(prev => [...prev, userMessage]);
    const currentPrompt = prompt;
    setPrompt('');
    setLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [{ parts: [{ text: currentPrompt }] }],
          config: {
            systemInstruction: "You are a friendly and knowledgeable travel assistant for Rwanda Bus, specializing in helping users plan bus journeys across Rwanda. Provide helpful, concise, and inspiring travel suggestions. Always respond in Kinyarwanda. When suggesting a route, mention the bus companies that might operate on that route, like RITCO, Volcano Express, or Horizon Express.",
          },
      });

      const aiMessage: Message = { sender: 'ai', text: response.text };
      setMessages(prev => [...prev, aiMessage]);

    } catch (err) {
      console.error(err);
      const errorMessage: Message = { sender: 'ai', text: 'Babuze interneti cyangwa habayeho ikibazo. Nyamuneka ongera ugerageze.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:to-[#001f52]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-4xl flex items-center justify-center">
            <SparklesIcon className="w-8 h-8 mr-3 text-yellow-500" />
            Tegura Urugendo na AI
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
            Baza umufasha wacu w'ubwenge ibibazo ku ngendo, ahantu ho gusura, n'ibindi byinshi!
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800/50 rounded-2xl shadow-2xl p-4 border dark:border-gray-700/50">
          <div ref={chatContainerRef} className="h-80 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                  <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none">
                     <div className="flex items-center space-x-2">
                         <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                         <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                         <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                     </div>
                  </div>
              </div>
            )}
          </div>
          
          <div className="mt-4 p-2 border-t border-gray-200 dark:border-gray-700 flex items-center">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Andika ikibazo cyawe hano..."
              className="flex-grow bg-transparent focus:outline-none text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
              disabled={loading}
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || !prompt.trim()}
              className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              aria-label="Ohereza ubutumwa"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AITripPlanner;
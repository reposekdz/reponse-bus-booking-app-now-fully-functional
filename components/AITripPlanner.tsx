
import React, { useState } from 'react';
// FIX: Import `Type` to use with responseSchema.
import { GoogleGenAI, Type } from "@google/genai";
import { XIcon, SparklesIcon, PaperAirplaneIcon } from './icons';

interface AITripPlannerProps {
  onClose: () => void;
  onPlanTrip: (from: string, to: string) => void;
}

const AITripPlanner: React.FC<AITripPlannerProps> = ({ onClose, onPlanTrip }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlanTrip = async () => {
    if (!prompt.trim()) {
      setError('Please describe your desired trip.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      const systemInstruction = `You are a helpful travel assistant for a bus booking platform in Rwanda. Your task is to extract key information from a user's travel request.
The available bus companies are: RITCO, Volcano Express, Horizon Express, ONATRACOM, STELLART.
Based on the user's prompt, determine the most logical departure city ('from'), destination city ('to'), and the best bus company for the route.
If a city is not explicitly mentioned, infer it from landmarks (e.g., 'see gorillas' implies Musanze, 'Nyungwe forest' implies Nyungwe).
The response MUST be a valid JSON object with the following structure and nothing else: {"from": "string", "to": "string"}. Do not add any extra text or markdown formatting.`;

      // FIX: Added responseSchema for more reliable JSON output as per Gemini API guidelines.
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    from: { type: Type.STRING },
                    to: { type: Type.STRING }
                },
                required: ['from', 'to']
            }
        }
      });
      
      const text = response.text.trim();
      const result = JSON.parse(text);

      if (result.from && result.to) {
        onPlanTrip(result.from, result.to);
        onClose();
      } else {
        throw new Error('Could not determine route from your request.');
      }
    } catch (e) {
      console.error(e);
      setError('Sorry, I couldn\'t understand your request. Please try being more specific about your departure and destination.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full relative" 
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-200 transition-colors z-10">
          <XIcon className="w-6 h-6" />
        </button>
        <div className="p-8">
          <div className="flex items-center space-x-3 mb-4">
            <SparklesIcon className="w-8 h-8 text-yellow-400" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">AI Trip Planner</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
            Describe your ideal trip, and we'll figure out the details. Try something like:
            <em className="block my-1 text-gray-500 dark:text-gray-500">"A weekend trip from Kigali to see the gorillas"</em>
             <em className="block text-gray-500 dark:text-gray-500">"I want to go from Huye to the lake in Rubavu"</em>
          </p>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500/50 focus:outline-none dark:bg-gray-700 dark:border-gray-600"
            placeholder="Tell us about your travel plans..."
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <button
            onClick={handlePlanTrip}
            disabled={isLoading}
            className="mt-4 w-full flex items-center justify-center p-3 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#0033A0] font-bold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-t-[#0033A0] border-l-[#0033A0] border-b-transparent border-r-transparent rounded-full animate-spin mr-2"></div>
                Planning...
              </>
            ) : (
              <>
                Plan My Trip <PaperAirplaneIcon className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AITripPlanner;

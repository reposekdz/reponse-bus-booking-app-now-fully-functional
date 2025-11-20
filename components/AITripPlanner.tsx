
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { XIcon, SparklesIcon, PaperAirplaneIcon, BusIcon, ArrowRightIcon, MapIcon } from './icons';

interface AITripPlannerProps {
  onClose: () => void;
  onPlanTrip: (from: string, to: string) => void;
}

const AITripPlanner: React.FC<AITripPlannerProps> = ({ onClose, onPlanTrip }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tripSuggestions, setTripSuggestions] = useState<any[] | null>(null);
  const [groundingMetadata, setGroundingMetadata] = useState<any | null>(null);

  const handlePlanTrip = async () => {
    if (!prompt.trim()) {
      setError('Please describe your desired trip.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setTripSuggestions(null);
    setGroundingMetadata(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.VITE_GOOGLE_API_KEY || process.env.API_KEY as string });
      
      const systemInstruction = `You are an expert travel itinerary planner for GoBus in Rwanda.
      Use Google Maps to find real locations, distances, and travel times between Rwandan cities.
      - Infer departure and destination cities from landmarks (e.g., 'gorillas' -> Musanze/Kinigi).
      - Suggest a specific route available on GoBus (Kigali, Musanze, Rubavu, Huye, Rusizi, Nyagatare, Muhanga).
      - Return a JSON object with a list of suggestions.
      - Each suggestion must include: justification, departure {from, to}, return (optional) {from, to}, and estimatedDuration (string from Maps).`;

      // Use gemini-2.5-flash with googleMaps tool for grounding
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: systemInstruction,
            tools: [{ googleMaps: {} }],
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                   suggestions: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                justification: { type: Type.STRING },
                                estimatedDuration: { type: Type.STRING },
                                departure: {
                                    type: Type.OBJECT,
                                    properties: { from: { type: Type.STRING }, to: { type: Type.STRING } },
                                    required: ['from', 'to']
                                },
                                return: {
                                    type: Type.OBJECT,
                                    properties: { from: { type: Type.STRING }, to: { type: Type.STRING } },
                                }
                            },
                            required: ['justification', 'departure']
                        }
                   }
                },
                required: ['suggestions']
            }
        }
      });
      
      const text = response.text;
      if (!text) throw new Error("No response from AI");

      const result = JSON.parse(text);
      
      // Extract grounding metadata if available (Maps links)
      if (response.candidates && response.candidates[0]?.groundingMetadata) {
          setGroundingMetadata(response.candidates[0].groundingMetadata);
      }

      if (result.suggestions && result.suggestions.length > 0) {
        setTripSuggestions(result.suggestions);
      } else {
        throw new Error('Could not determine a valid route from your request.');
      }
    } catch (e: any) {
      console.error(e);
      setError('Sorry, I had trouble creating a plan. Please try again with more specific details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
      onPlanTrip(suggestion.departure.from, suggestion.departure.to);
      onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full relative max-h-[90vh] flex flex-col" 
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-200 transition-colors z-10">
          <XIcon className="w-6 h-6" />
        </button>
        
        <div className="p-8 flex-shrink-0">
          <div className="flex items-center space-x-3 mb-4">
            <SparklesIcon className="w-8 h-8 text-yellow-400" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">AI Trip Planner</h2>
          </div>
          
          {!tripSuggestions ? (
            <>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                    Describe your ideal trip (e.g., "Weekend trip to Lake Kivu"). We use Google Maps to find the best routes.
                </p>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500/50 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Where do you want to go?"
                />
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                <button
                    onClick={handlePlanTrip}
                    disabled={isLoading}
                    className="mt-4 w-full flex items-center justify-center p-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-t-white border-l-white border-b-transparent border-r-transparent rounded-full animate-spin mr-2"></div>
                        Planning with Maps...
                    </>
                    ) : (
                    <>
                        Plan Trip <PaperAirplaneIcon className="w-5 h-5 ml-2" />
                    </>
                    )}
                </button>
            </>
          ) : (
            <div className="flex flex-col h-full">
                <h3 className="font-bold text-lg dark:text-white mb-2">Suggested Itineraries:</h3>
                <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2 flex-grow">
                    {tripSuggestions.map((suggestion, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border dark:border-gray-700/50 shadow-sm hover:shadow-md transition-shadow">
                            <p className="text-sm italic text-gray-600 dark:text-gray-300 mb-3">"{suggestion.justification}"</p>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                     <div className="flex items-center space-x-2 text-gray-800 dark:text-white">
                                        <BusIcon className="w-5 h-5 text-blue-500"/>
                                        <p className="font-semibold">{suggestion.departure.from} <ArrowRightIcon className="inline w-4 h-4 text-gray-400"/> {suggestion.departure.to}</p>
                                    </div>
                                    {suggestion.estimatedDuration && (
                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
                                            <MapIcon className="w-3 h-3 mr-1"/> {suggestion.estimatedDuration}
                                        </span>
                                    )}
                                </div>
                                {suggestion.return && (
                                    <div className="flex items-center space-x-2 text-gray-800 dark:text-white">
                                        <BusIcon className="w-5 h-5 text-green-500"/>
                                        <p className="font-semibold">{suggestion.return.from} <ArrowRightIcon className="inline w-4 h-4 text-gray-400"/> {suggestion.return.to}</p>
                                    </div>
                                )}
                            </div>
                            <button onClick={() => handleSuggestionClick(suggestion)} className="mt-4 w-full text-sm font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 py-2 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors">
                                Book This Trip
                            </button>
                        </div>
                    ))}
                </div>

                {/* Maps Grounding Source Attribution */}
                {groundingMetadata?.groundingChunks && (
                    <div className="mt-4 pt-4 border-t dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Source Data from Google Maps:</p>
                        <div className="flex flex-wrap gap-2">
                            {groundingMetadata.groundingChunks.map((chunk: any, idx: number) => {
                                if (chunk.web?.uri) {
                                    return (
                                        <a key={idx} href={chunk.web.uri} target="_blank" rel="noreferrer" className="text-[10px] bg-gray-100 dark:bg-gray-700 text-blue-500 px-2 py-1 rounded hover:underline truncate max-w-[150px]">
                                            {chunk.web.title || 'Map Source'}
                                        </a>
                                    )
                                }
                                return null;
                            })}
                        </div>
                    </div>
                )}

                 <button onClick={() => { setTripSuggestions(null); setPrompt(''); }} className="mt-4 text-sm text-center w-full text-gray-500 hover:underline">
                    Plan another trip
                </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AITripPlanner;

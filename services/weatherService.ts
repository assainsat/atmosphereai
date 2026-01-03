
import { GoogleGenAI, Type } from "@google/genai";
import { WeatherData, AiRecommendation } from "../types/weather";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchWeatherByLocation = async (query: string): Promise<{ weather: WeatherData; aiRec: AiRecommendation; sources: any[] }> => {
  const model = "gemini-3-flash-preview";
  
  const weatherPrompt = `
    Find the CURRENT weather data for "${query}". 
    Return the data as a JSON object with the following structure:
    {
      "city": "string",
      "country": "string",
      "temperature": number (Celsius),
      "condition": "string (Clear, Cloudy, Rain, Snow, Thunderstorm, Mist)",
      "description": "string (detailed condition)",
      "humidity": number (percentage),
      "windSpeed": number (km/h),
      "pressure": number (hPa),
      "visibility": number (km),
      "feelsLike": number (Celsius),
      "uvIndex": number,
      "sunrise": "string (HH:MM AM/PM)",
      "sunset": "string (HH:MM AM/PM)",
      "forecast": [
        { "day": "DayName", "high": number, "low": number, "condition": "string", "chanceOfRain": number }
      ] (5 days)
    }
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: weatherPrompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          city: { type: Type.STRING },
          country: { type: Type.STRING },
          temperature: { type: Type.NUMBER },
          condition: { type: Type.STRING },
          description: { type: Type.STRING },
          humidity: { type: Type.NUMBER },
          windSpeed: { type: Type.NUMBER },
          pressure: { type: Type.NUMBER },
          visibility: { type: Type.NUMBER },
          feelsLike: { type: Type.NUMBER },
          uvIndex: { type: Type.NUMBER },
          sunrise: { type: Type.STRING },
          sunset: { type: Type.STRING },
          forecast: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING },
                high: { type: Type.NUMBER },
                low: { type: Type.NUMBER },
                condition: { type: Type.STRING },
                chanceOfRain: { type: Type.NUMBER }
              }
            }
          }
        },
        required: ["city", "temperature", "condition", "forecast"]
      }
    }
  });

  const weatherData: WeatherData = JSON.parse(response.text);
  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

  // Fetch AI Recommendations based on the data
  const recResponse = await ai.models.generateContent({
    model: model,
    contents: `Based on this weather in ${weatherData.city}: ${weatherData.temperature}°C, ${weatherData.condition}, ${weatherData.description}. 
    Provide lifestyle advice in JSON:
    {
      "summary": "Short 1-sentence summary",
      "clothing": ["item1", "item2"],
      "activities": "Best activities for today",
      "healthTip": "UV or allergy advice"
    }`,
    config: {
      responseMimeType: "application/json"
    }
  });

  const aiRec: AiRecommendation = JSON.parse(recResponse.text);

  return { 
    weather: { ...weatherData, timestamp: new Date().toISOString() }, 
    aiRec, 
    sources 
  };
};

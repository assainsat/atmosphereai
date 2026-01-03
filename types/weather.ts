
export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  feelsLike: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  forecast: DailyForecast[];
  timestamp: string;
}

export interface DailyForecast {
  day: string;
  high: number;
  low: number;
  condition: string;
  chanceOfRain: number;
}

export interface AiRecommendation {
  summary: string;
  clothing: string[];
  activities: string;
  healthTip: string;
}

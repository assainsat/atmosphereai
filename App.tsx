
import React, { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Loader2, ThermometerSun, AlertCircle, History, Github } from 'lucide-react';
import { WeatherHero } from './components/WeatherHero';
import { WeatherDetails, ForecastSection } from './components/WeatherDetails';
import { AiInsight } from './components/AiInsight';
import { fetchWeatherByLocation } from './services/weatherService';
import { WeatherData, AiRecommendation } from './types/weather';
import { GlassCard } from './components/ui/GlassCard';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [aiRec, setAiRec] = useState<AiRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFahrenheit, setIsFahrenheit] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [sources, setSources] = useState<any[]>([]);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherByLocation(searchQuery);
      setWeather(data.weather);
      setAiRec(data.aiRec);
      setSources(data.sources);
      setSearchHistory(prev => {
        const next = [data.weather.city, ...prev.filter(c => c !== data.weather.city)];
        return next.slice(0, 5);
      });
      setQuery('');
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch weather. Please try a different location.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleGeoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          handleSearch(`${position.coords.latitude}, ${position.coords.longitude}`);
        },
        () => setError("Location access denied. Please type your city.")
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    handleSearch("San Francisco");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden">
      {/* Header / Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#030712]/60 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-500/20">
              <ThermometerSun className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-extrabold tracking-tighter text-white">ATMOSPHERE <span className="text-blue-500">AI</span></h1>
          </div>
          
          <div className="flex items-center space-x-4">
             <button 
                onClick={() => setIsFahrenheit(!isFahrenheit)}
                className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-white/60 hover:text-white hover:bg-white/10 transition-all"
             >
               <span>{isFahrenheit ? 'FAHRENHEIT' : 'CELSIUS'}</span>
               <div className="w-1 h-1 bg-white/20 rounded-full"></div>
               <span className="text-blue-400">SWITCH</span>
             </button>
             <a href="https://github.com" target="_blank" className="p-2 text-white/40 hover:text-white transition-colors">
               <Github className="w-5 h-5" />
             </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar / Left Column */}
        <div className="lg:col-span-4 flex flex-col space-y-8">
          
          {/* Search Box */}
          <div className="space-y-4">
            <div className="relative group">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                placeholder="Search city..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all shadow-2xl"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-blue-500 transition-colors" />
              <button 
                onClick={handleGeoLocation}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all"
              >
                <MapPin className="w-4 h-4" />
              </button>
            </div>

            {searchHistory.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((city) => (
                  <button 
                    key={city}
                    onClick={() => handleSearch(city)}
                    className="flex items-center space-x-1.5 px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-[10px] font-bold text-white/40 hover:text-white/90 hover:border-white/20 transition-all uppercase tracking-wider"
                  >
                    <History className="w-3 h-3" />
                    <span>{city}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center space-x-3 text-rose-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Forecast Sidebar */}
          {weather && (
            <div className="hidden lg:block">
              <ForecastSection forecast={weather.forecast} isFahrenheit={isFahrenheit} />
            </div>
          )}

          {/* Sources Grounding */}
          {sources.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Verified Sources</h4>
              <div className="flex flex-col space-y-2">
                {sources.slice(0, 3).map((chunk, i) => (
                  <a 
                    key={i} 
                    href={chunk.web?.uri} 
                    target="_blank" 
                    className="text-xs text-blue-400/80 hover:text-blue-300 transition-colors truncate"
                  >
                    {chunk.web?.title || chunk.web?.uri}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Center / Right Column */}
        <div className="lg:col-span-8 space-y-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
              <div className="relative">
                 <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                 <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-10 animate-pulse"></div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-lg font-bold text-white animate-pulse tracking-tight">Syncing with Atmosphere AI...</p>
                <p className="text-sm text-white/30 font-medium">Gathering meteorological data and real-time grounding</p>
              </div>
            </div>
          ) : weather ? (
            <>
              <GlassCard className="!bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/5">
                <WeatherHero weather={weather} isFahrenheit={isFahrenheit} />
              </GlassCard>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8">
                <WeatherDetails weather={weather} isFahrenheit={isFahrenheit} />
                <div className="lg:hidden">
                  <ForecastSection forecast={weather.forecast} isFahrenheit={isFahrenheit} />
                </div>
              </div>

              {aiRec && <AiInsight insight={aiRec} />}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center px-12 space-y-6">
               <div className="bg-white/5 p-8 rounded-full">
                <Cloud className="w-20 h-20 text-white/10" />
               </div>
               <div className="space-y-2">
                 <h2 className="text-2xl font-bold text-white">No Weather Data</h2>
                 <p className="text-white/30 max-w-sm">Search for a city or use your location to see real-time atmospheric conditions and AI recommendations.</p>
               </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="mt-20 border-t border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="flex items-center space-x-3">
             <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
               <ThermometerSun className="w-4 h-4 text-white/40" />
             </div>
             <p className="text-sm font-medium text-white/30">© 2024 Atmosphere AI. All rights reserved.</p>
          </div>
          <div className="flex space-x-8 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
            <span className="hover:text-white/60 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white/60 cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white/60 cursor-pointer transition-colors">API Docs</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Simple reusable Cloud icon for the empty state
const Cloud = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
  </svg>
);

export default App;

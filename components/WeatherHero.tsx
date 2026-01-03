
import React from 'react';
import { WeatherData } from '../types/weather';
import { Cloud, Sun, CloudRain, Wind, CloudLightning, CloudSnow, Droplets } from 'lucide-react';

interface WeatherHeroProps {
  weather: WeatherData;
  isFahrenheit: boolean;
}

const WeatherIcon = ({ condition, className }: { condition: string; className?: string }) => {
  const cond = condition.toLowerCase();
  if (cond.includes('sun') || cond.includes('clear')) return <Sun className={`${className} text-yellow-400`} />;
  if (cond.includes('rain')) return <CloudRain className={`${className} text-blue-400`} />;
  if (cond.includes('lightning') || cond.includes('storm')) return <CloudLightning className={`${className} text-purple-400`} />;
  if (cond.includes('snow')) return <CloudSnow className={`${className} text-white`} />;
  if (cond.includes('wind')) return <Wind className={`${className} text-gray-300`} />;
  if (cond.includes('mist') || cond.includes('fog')) return <Droplets className={`${className} text-teal-300`} />;
  return <Cloud className={`${className} text-gray-400`} />;
};

export const WeatherHero: React.FC<WeatherHeroProps> = ({ weather, isFahrenheit }) => {
  const displayTemp = (c: number) => isFahrenheit ? Math.round((c * 9/5) + 32) : Math.round(c);

  return (
    <div className="relative flex flex-col items-center justify-center py-12 px-6">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/20 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      
      <div className="flex flex-col items-center text-center space-y-2">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
          {weather.city}, <span className="text-white/60 font-medium">{weather.country}</span>
        </h2>
        <p className="text-lg text-white/50 font-medium">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="mt-10 mb-6 flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-12">
        <div className="relative">
          <WeatherIcon condition={weather.condition} className="w-40 h-40 md:w-52 md:h-52 drop-shadow-2xl animate-pulse" />
        </div>
        
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-start">
            <span className="text-8xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 leading-none">
              {displayTemp(weather.temperature)}
            </span>
            <span className="text-4xl md:text-5xl font-light text-white/60 mt-4 leading-none">
              °{isFahrenheit ? 'F' : 'C'}
            </span>
          </div>
          <p className="text-2xl md:text-3xl font-semibold text-white/90 capitalize mt-2">
            {weather.description}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-8 w-full max-w-2xl">
        <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-full flex items-center space-x-3 backdrop-blur-md">
          <Wind className="w-5 h-5 text-blue-400" />
          <span className="text-sm font-medium text-white/80">{weather.windSpeed} km/h Wind</span>
        </div>
        <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-full flex items-center space-x-3 backdrop-blur-md">
          <Droplets className="w-5 h-5 text-cyan-400" />
          <span className="text-sm font-medium text-white/80">{weather.humidity}% Humidity</span>
        </div>
        <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-full flex items-center space-x-3 backdrop-blur-md">
          <Sun className="w-5 h-5 text-orange-400" />
          <span className="text-sm font-medium text-white/80">UV {weather.uvIndex}</span>
        </div>
      </div>
    </div>
  );
};


import React from 'react';
import { WeatherData } from '../types/weather';
import { GlassCard } from './ui/GlassCard';
import { Compass, Eye, Thermometer, Sunrise, Sunset, Activity } from 'lucide-react';

interface WeatherDetailsProps {
  weather: WeatherData;
  isFahrenheit: boolean;
}

export const WeatherDetails: React.FC<WeatherDetailsProps> = ({ weather, isFahrenheit }) => {
  const displayTemp = (c: number) => isFahrenheit ? Math.round((c * 9/5) + 32) : Math.round(c);

  const stats = [
    { label: 'Feels Like', value: `${displayTemp(weather.feelsLike)}°`, icon: Thermometer, color: 'text-orange-400' },
    { label: 'Visibility', value: `${weather.visibility} km`, icon: Eye, color: 'text-blue-400' },
    { label: 'Pressure', value: `${weather.pressure} hPa`, icon: Activity, color: 'text-green-400' },
    { label: 'Wind Dir', value: `North East`, icon: Compass, color: 'text-indigo-400' },
    { label: 'Sunrise', value: weather.sunrise, icon: Sunrise, color: 'text-yellow-400' },
    { label: 'Sunset', value: weather.sunset, icon: Sunset, color: 'text-rose-400' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {stats.map((stat, i) => (
        <GlassCard key={i} className="p-5 flex flex-col justify-between h-32 hover:border-white/20">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">{stat.label}</span>
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </div>
          <span className="text-2xl font-bold text-white/90">{stat.value}</span>
        </GlassCard>
      ))}
    </div>
  );
};

export const ForecastSection: React.FC<{ forecast: WeatherData['forecast'], isFahrenheit: boolean }> = ({ forecast, isFahrenheit }) => {
  const displayTemp = (c: number) => isFahrenheit ? Math.round((c * 9/5) + 32) : Math.round(c);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white px-2">5-Day Forecast</h3>
      <div className="grid grid-cols-1 gap-3">
        {forecast.map((day, idx) => (
          <GlassCard key={idx} className="flex items-center justify-between p-4 hover:bg-white/10 group">
            <div className="w-24 font-semibold text-white/90 group-hover:text-blue-400 transition-colors">
              {idx === 0 ? 'Today' : day.day}
            </div>
            <div className="flex items-center space-x-4">
               <span className="text-sm text-white/40 italic">{day.condition}</span>
               <div className="flex flex-col items-end w-20">
                 <span className="font-bold text-white">{displayTemp(day.high)}°</span>
                 <span className="text-sm text-white/30">{displayTemp(day.low)}°</span>
               </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

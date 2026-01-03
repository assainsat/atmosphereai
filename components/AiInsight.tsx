
import React from 'react';
import { AiRecommendation } from '../types/weather';
import { GlassCard } from './ui/GlassCard';
import { Sparkles, Shirt, Bike, ShieldCheck } from 'lucide-react';

export const AiInsight: React.FC<{ insight: AiRecommendation }> = ({ insight }) => {
  return (
    <GlassCard className="p-8 border-blue-500/20 bg-blue-500/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Sparkles className="w-24 h-24 text-blue-400" />
      </div>

      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <Sparkles className="w-6 h-6 text-blue-400" />
        </div>
        <h3 className="text-2xl font-bold text-white">Atmosphere AI Insights</h3>
      </div>

      <p className="text-xl font-medium text-white/80 italic mb-8 border-l-4 border-blue-500/40 pl-4 leading-relaxed">
        "{insight.summary}"
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-white/40">
            <Shirt className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Recommended Gear</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {insight.clothing.map((item, i) => (
              <span key={i} className="px-3 py-1 bg-white/10 rounded-lg text-sm font-medium text-white/90">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-white/40">
            <Bike className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Outdoor Plan</span>
          </div>
          <p className="text-sm text-white/70 leading-relaxed font-medium">
            {insight.activities}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-white/40">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Health & Wellness</span>
          </div>
          <p className="text-sm text-white/70 leading-relaxed font-medium">
            {insight.healthTip}
          </p>
        </div>
      </div>
    </GlassCard>
  );
};

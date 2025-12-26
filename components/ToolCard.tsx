import React from 'react';
import { Tool } from '../types';
import { ArrowUpRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface ToolCardProps {
  tool: Tool;
  onClick: (tool: Tool) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      onClick={() => onClick(tool)}
      className="group cursor-pointer bg-dark-800 border border-dark-700 hover:border-brand-500/50 rounded-2xl overflow-hidden flex flex-col h-full shadow-lg hover:shadow-brand-500/10 transition-all duration-300 relative"
    >
      {/* Image Section - Fixed Height for Grid Consistency */}
      <div className="relative h-44 shrink-0 overflow-hidden bg-dark-900">
        {tool.imageUrl ? (
          <>
            <img 
              src={tool.imageUrl} 
              alt={tool.name} 
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-800 via-dark-900/40 to-transparent opacity-90" />
            <div className="absolute inset-0 bg-brand-900/0 group-hover:bg-brand-900/10 transition-colors" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-dark-800 to-dark-700">
             <span className="text-5xl font-bold text-white/10">{tool.name.charAt(0)}</span>
          </div>
        )}
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 z-10">
          <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md bg-dark-900/95 backdrop-blur-md text-gray-200 border border-white/10 shadow-sm">
            {tool.category}
          </span>
        </div>

        <div className="absolute top-4 right-4 z-10 flex gap-2">
          {tool.status === 'active' && (
             <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 backdrop-blur-md border border-green-500/50 shadow-[0_0_12px_rgba(34,197,94,0.5)]" title="Активно используется">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
             </div>
          )}
          
          {tool.score && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-dark-900/90 backdrop-blur-md border border-white/10 text-yellow-400 text-xs font-bold shadow-sm">
              <Star size={10} className="fill-yellow-400" />
              <span>{tool.score}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col -mt-10 relative z-10">
        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-3 drop-shadow-md group-hover:text-brand-400 transition-colors">
          {tool.name}
        </h3>

        <div className="flex-1 flex flex-col gap-3">
          {/* Description */}
          <p className="text-sm text-gray-300 leading-relaxed font-normal line-clamp-4">
            {tool.description}
          </p>
        </div>

        {/* Footer / Use Cases */}
        <div className="mt-5 pt-4 border-t border-dark-700/50 flex items-end justify-between gap-3 shrink-0">
           <div className="flex-1 min-w-0">
             {tool.useCases && (
               <div className="flex flex-wrap gap-1.5 max-h-12 overflow-hidden">
                  {tool.useCases.split(/[\n•]/).slice(0, 3).map((uc, i) => {
                    const cleanUc = uc.trim();
                    if (!cleanUc) return null;
                    // Extract title if colon exists (e.g. "Title: Description")
                    const label = cleanUc.includes(':') ? cleanUc.split(':')[0].trim() : cleanUc;
                    return (
                      <span key={i} className="text-[10px] font-medium text-gray-400 bg-dark-900 border border-dark-700 px-2 py-1 rounded-md whitespace-nowrap">
                        {label}
                      </span>
                    );
                  })}
               </div>
             )}
           </div>
           
          <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center text-gray-400 group-hover:bg-brand-600 group-hover:text-white transition-all shrink-0 shadow-lg">
             <ArrowUpRight size={16} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
import React from 'react';
import { Tool } from '../types';
import { X, ExternalLink, Tag, CheckCircle, Star, CreditCard, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToolModalProps {
  tool: Tool | null;
  onClose: () => void;
}

export const ToolModal: React.FC<ToolModalProps> = ({ tool, onClose }) => {
  if (!tool) return null;

  let useCasesList = tool.useCases
    ? tool.useCases.split(/\n|•/).filter(s => s.trim().length > 0)
    : [];

  // Split pricing string by newlines to get individual plans
  const pricingPlans = tool.pricing 
    ? tool.pricing.split('\n').filter(s => s.trim().length > 0)
    : [];

  const paymentLink = tool.paymentLink || "https://t.me/paymentserv_bot";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          className="relative w-full max-w-3xl bg-dark-800 border border-dark-600 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header Image */}
          <div className="h-48 sm:h-64 relative bg-dark-900 shrink-0">
            {tool.imageUrl ? (
              <img src={tool.imageUrl} alt={tool.name} className="w-full h-full object-cover opacity-70" />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-brand-600 to-purple-600 opacity-50" />
            )}
            <button 
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors z-20"
            >
              <X size={24} />
            </button>
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-dark-800 via-dark-800/80 to-transparent">
              <div className="flex items-center gap-3 mb-3">
                 <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md bg-brand-600 text-white shadow-lg">
                   {tool.category}
                 </span>
                 {tool.score && (
                   <span className="flex items-center gap-1 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 backdrop-blur-sm">
                     <Star size={14} className="fill-yellow-400" />
                     {tool.score}/10
                   </span>
                 )}
              </div>
              <h2 className="text-4xl font-bold text-white drop-shadow-lg">{tool.name}</h2>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 overflow-y-auto">
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <Tag size={20} className="text-brand-500"/>
                Описание
              </h3>
              <p className="text-gray-200 leading-relaxed text-lg">
                {tool.description}
              </p>
            </div>

            {pricingPlans.length > 0 && (
               <div className="mb-8 p-6 rounded-xl bg-dark-700/30 border border-dark-600">
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <CreditCard size={20} className="text-brand-400" />
                  Тарифные планы
                </h3>
                <div className="flex flex-col gap-3">
                  {pricingPlans.map((plan, index) => {
                    // Try to split by colon to separate Plan Name from Details
                    // Example: "Pro: $20/mo" -> name="Pro", details="$20/mo"
                    const separatorIndex = plan.indexOf(':');
                    let name = plan;
                    let details = '';
                    
                    if (separatorIndex !== -1) {
                      name = plan.substring(0, separatorIndex).trim();
                      details = plan.substring(separatorIndex + 1).trim();
                    }

                    const isFree = name.toLowerCase().includes('бесплатно') || name.toLowerCase().includes('free');

                    return (
                      <div 
                        key={index} 
                        className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-baseline gap-2 transition-all hover:bg-dark-700/50 ${
                          isFree 
                            ? 'bg-emerald-500/5 border-emerald-500/20' 
                            : 'bg-dark-900/40 border-dark-600'
                        }`}
                      >
                        <span className={`font-bold text-lg whitespace-nowrap shrink-0 ${
                          isFree ? 'text-emerald-400' : 'text-brand-400'
                        }`}>
                          {name}{details ? ':' : ''}
                        </span>
                        {details && (
                          <span className="text-gray-300 text-base leading-snug">
                            {details}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {useCasesList.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <CheckCircle size={20} className="text-green-400"/>
                  Кейсы использования
                </h3>
                <ul className="grid gap-4 sm:grid-cols-2">
                  {useCasesList.map((useCase, idx) => (
                    <li key={idx} className="flex items-start gap-3 bg-dark-700/40 p-4 rounded-xl border border-dark-700">
                      <span className="w-2 h-2 rounded-full bg-green-400 mt-2 shrink-0" />
                      <span className="text-gray-200 text-base">{useCase.trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-dark-700 bg-dark-800 shrink-0 flex flex-col sm:flex-row gap-4">
            <a 
              href={tool.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-dark-700 hover:bg-dark-600 text-white rounded-xl font-bold text-lg transition-all"
            >
              Открыть сайт <ExternalLink size={20} />
            </a>
            <a 
              href={paymentLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-brand-600/20 hover:shadow-brand-600/40"
            >
              Оплатить тариф <ShoppingCart size={20} />
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
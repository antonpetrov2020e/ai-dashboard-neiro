import React, { useState, useMemo } from 'react';
import { 
  Search, Layers, Zap, Info, 
  LayoutGrid, Bot, Globe, Code, Mic, 
  Palette, Video, MonitorPlay, Workflow, 
  CreditCard, Box, Sparkles, CalendarCheck 
} from 'lucide-react';
import { Tool } from './types';
import { MOCK_TOOLS, CATEGORY_DEFINITIONS } from './constants';
import { ToolCard } from './components/ToolCard';
import { ToolModal } from './components/ToolModal';
import { AiChat } from './components/AiChat';
import { motion, AnimatePresence } from 'framer-motion';

// Icon Mapping
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'Все': LayoutGrid,
  'Генеративные LLM': Bot,
  'Поиск и браузеры': Globe,
  'Разработка и код': Code,
  'Продуктивность': CalendarCheck,
  'Аудио и звук': Mic,
  'Дизайн и графика': Palette,
  'Создание видео': Video,
  'AI-агенты и автоматизация': Workflow,
};

// Helper for Russian declension
const getToolDeclension = (count: number) => {
  const mod10 = Math.abs(count) % 10;
  const mod100 = Math.abs(count) % 100;

  if (mod100 > 10 && mod100 < 20) {
    return 'активных инструментов';
  }
  if (mod10 > 1 && mod10 < 5) {
    return 'активных инструмента';
  }
  if (mod10 === 1) {
    return 'активный инструмент';
  }
  return 'активных инструментов';
};

const App: React.FC = () => {
  // State
  // Directly use MOCK_TOOLS as the source of truth
  const [tools] = useState<Tool[]>(MOCK_TOOLS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  // Derived State
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    tools.forEach(t => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    counts['Все'] = tools.length;
    return counts;
  }, [tools]);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(tools.map(t => t.category))).filter(Boolean);
    
    // Sort by count descending (most popular first)
    unique.sort((a, b) => {
      const countA = categoryCounts[a] || 0;
      const countB = categoryCounts[b] || 0;
      return countB - countA;
    });

    return ['Все', ...unique];
  }, [tools, categoryCounts]);

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesCategory = selectedCategory === 'Все' || tool.category === selectedCategory;
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [tools, selectedCategory, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: tools.length,
      categories: categories.length - 1, 
    };
  }, [tools, categories]);

  return (
    <div className="min-h-screen font-sans selection:bg-brand-500 selection:text-white pb-24">
      
      {/* Decorative Background Elements */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-brand-500/10 rounded-full blur-[100px] pointer-events-none animate-blob" />
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none animate-blob animation-delay-2000" />

      {/* Navbar */}
      <header className="sticky top-0 z-30 bg-dark-900/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-brand-500/20 border border-white/10">
              <Layers className="text-white" size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Tech<span className="text-brand-400">Stack</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="text-sm text-gray-400 font-medium">
              {stats.total} {getToolDeclension(stats.total)}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-10 sm:pt-20 sm:pb-16 px-4 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 text-brand-400 text-sm font-medium border border-brand-500/20 mb-8">
            <Zap size={16} className="fill-brand-400" />
            Арсенал Виктора Медведева
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-8 tracking-tight leading-none">
            Инструменты, которые <br className="hidden sm:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-purple-400 to-pink-400">
              ускоряют работу
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            Интерактивный дашборд нейросетей, сервисов и утилит, которые использует Виктор Медведев ежедневно для продуктивности, разработки и создания контента
          </p>

          {/* Search Bar (Hero) */}
          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-500 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-50 blur transition duration-500"></div>
            <div className="relative flex items-center bg-dark-900 border border-dark-700 rounded-xl shadow-2xl p-2.5">
              <Search className="text-gray-500 ml-4" size={24} />
              <input 
                type="text" 
                placeholder="Найти инструмент, категорию или задачу..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-white border-none focus:ring-0 placeholder-gray-500 py-3 px-4 outline-none text-lg"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Categories Navigation (Cloud/Grid Layout) */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(cat => {
              const Icon = CATEGORY_ICONS[cat] || Sparkles; // Default icon if not found
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`group flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                    selectedCategory === cat 
                      ? 'bg-brand-600 border-brand-500 text-white shadow-lg shadow-brand-900/20 transform scale-105' 
                      : 'bg-dark-800/80 backdrop-blur-sm border-dark-700 text-gray-400 hover:bg-dark-700 hover:text-white hover:border-dark-600'
                  }`}
                >
                  <Icon size={18} className={selectedCategory === cat ? 'text-white' : 'text-gray-500 group-hover:text-brand-400'} />
                  <span>{cat}</span>
                  <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                    selectedCategory === cat
                      ? 'bg-white/20 text-white'
                      : 'bg-dark-900/50 text-gray-500 group-hover:bg-dark-900 group-hover:text-gray-300'
                  }`}>
                    {categoryCounts[cat] || 0}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Category Info Block */}
          <AnimatePresence mode="wait">
            {selectedCategory !== 'Все' && CATEGORY_DEFINITIONS[selectedCategory] && (
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="overflow-hidden mt-8 max-w-4xl mx-auto"
              >
                <div className="bg-brand-900/10 border border-brand-500/20 rounded-2xl p-6 flex gap-5 items-start">
                  <div className="p-3 bg-brand-500/20 rounded-xl text-brand-400 shrink-0">
                    <Info size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2 text-lg">{selectedCategory}</h4>
                    <p className="text-gray-300 text-base leading-relaxed">
                      {CATEGORY_DEFINITIONS[selectedCategory]}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Grid */}
        <div className="min-h-[400px]">
          {filteredTools.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {filteredTools.map(tool => (
                <ToolCard 
                  key={tool.id} 
                  tool={tool} 
                  onClick={setSelectedTool} 
                />
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-dark-800/30 rounded-3xl border border-dashed border-dark-700">
              <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center mb-6 text-gray-600">
                <Search size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Ничего не найдено</h3>
              <p className="text-gray-400 max-w-sm mx-auto text-lg">
                По запросу «{searchQuery}» ничего не нашлось в категории «{selectedCategory}».
              </p>
              <button 
                onClick={() => {setSearchQuery(''); setSelectedCategory('Все')}}
                className="mt-8 text-brand-400 hover:text-brand-300 font-semibold text-base"
              >
                Сбросить фильтры
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-16 mt-16 border-t border-dark-800 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} My Tech Stack. Powered by Gemini & React.</p>
      </footer>

      {/* Modals & Overlays */}
      <ToolModal tool={selectedTool} onClose={() => setSelectedTool(null)} />
      
      <AiChat tools={tools} />
      
    </div>
  );
};

export default App;
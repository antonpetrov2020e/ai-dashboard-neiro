import React, { useState } from 'react';
import { X, Save, FileSpreadsheet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUrl: string;
  onSave: (url: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentUrl, onSave }) => {
  const [url, setUrl] = useState(currentUrl);

  const handleSave = () => {
    onSave(url);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-lg bg-dark-800 border border-dark-600 rounded-2xl shadow-2xl p-8"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <FileSpreadsheet className="text-green-500" size={28} />
                Настройки данных
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X size={28} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-base font-medium text-gray-200 mb-3">
                  Google Sheet CSV URL
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/e/.../pub?output=csv"
                  className="w-full bg-dark-900 border border-dark-700 rounded-xl p-4 text-white text-base focus:border-brand-500 focus:outline-none transition-colors"
                />
                <p className="mt-4 text-sm text-gray-400 leading-relaxed">
                  Чтобы это работало:
                  <br/>1. Откройте Google Таблицу.
                  <br/>2. Нажмите <b>Файл > Поделиться > Опубликовать в интернете</b>.
                  <br/>3. Выберите «Весь документ» и «CSV».
                  <br/>4. Скопируйте ссылку и вставьте сюда.
                </p>
              </div>
              
              <button
                onClick={handleSave}
                className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Save size={20} />
                Сохранить и Обновить
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
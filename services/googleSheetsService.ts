import Papa from 'papaparse';
import { Tool } from '../types';

export const fetchToolsFromSheet = async (csvUrl: string): Promise<Tool[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvUrl, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const tools: Tool[] = results.data.map((row: any, index: number) => {
            // Map CSV columns to our interface. 
            // Flexible naming to handle different column headers in the sheet
            return {
              id: `sheet-${index}`,
              name: row['Name'] || row['name'] || row['Инструмент'] || 'Untitled',
              category: row['Category'] || row['category'] || row['Категория'] || 'Uncategorized',
              description: row['Description'] || row['description'] || row['Описание'] || '',
              link: row['Link'] || row['link'] || row['Ссылка'] || '#',
              useCases: row['Use Cases'] || row['use cases'] || row['Кейсы'] || '',
              imageUrl: row['Image URL'] || row['image'] || row['Картинка'] || undefined,
              pricing: row['Pricing'] || row['pricing'] || row['Цена'] || row['Стоимость'] || undefined,
              score: parseInt(row['Score'] || row['score'] || row['Рейтинг'] || row['Оценка']) || undefined,
              status: row['Status'] || row['status'] || row['Статус'] || undefined,
              paymentLink: row['Payment Link'] || row['payment_link'] || row['Оплата'] || undefined
            };
          });
          resolve(tools);
        } catch (err) {
          reject(err);
        }
      },
      error: (err) => {
        reject(err);
      }
    });
  });
};
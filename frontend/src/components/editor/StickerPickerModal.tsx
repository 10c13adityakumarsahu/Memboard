import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StickerPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (svgBase64: string) => void;
}

const STICKERS = [
  {
    name: 'Yellow Star',
    svg: 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZiYmYyNCIgc3Ryb2tlPSIjZjU5ZTBiIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTExLjA0OSAydi4wMDFtMCAwbTIuMDk4LTIuMDAxYy4wMy4wNS4wNS4xMS4wNS4xNlYyLjAxMWMtLjAxLjA1LS4wMy4xMS0uMDUuMTZtMCBvbS0yLjA5OCAyLjAwMXYuMDAxbTAgMG0wLTEuMDAydi4wMDFtMCAwYy0uMDMtLjA1LS4wNS0uMTEtLjA1LS4xNlYxLjk5YzAuMDEtLjA1LjAzLS4xMS4wNS0uMTZtMCAwdS4wMDFtMCAwYy40MzYuODkxIDEuMjQgMS42OTYgMi4xMyAyLjEzMTEgMS4xNi0uNDk5IDIuMzcyLS45NDMgMy41MzUtMS4zMzdsMS40MTQtMS40MTRhMTEuOTU1IDExLjk1NSAwIDAxMS4zMzcgMy41MzVDMjIuMzA0IDEwLjc2IDIxLjUgMTEuNTY0IDIwLjYxIDEyYzAuNC4xMTYuOTQzIDExLjczIDEuMzM3IDEyLjg5M2wxLjQxNCAxLjQxNGExMS45NTUgMTEuOTU1IDAgMDEtMS4zMzcgMy41MzVjLTEuMTYtLjQ5OS0yLjM3Mi0uOTQzLTMuNTM1LTEuMzM3QzE3Ljk2MyAxNC44OTIgMTcuMTU5IDE1LjY5NiAxNi4yNjggMTYuMTMyYy0uNC4xMTYtLjk0MyAxMS43My0xLjMzNyAxMi44OTNsLTEuNDE0IDEuNDE0YTExLjk1NSAxMS45NTUgMCAwMS0zLjUzNS0xLjMzN2MtLjQ5OS0xLjE2LS45NDMtMi4zNzItMS4zMzctMy41MzVDNy42OTYgMjQuNDM2IDYuODkyIDIzLjYzIDYuMDAxIDIzLjE5NGMtMS4xNi40OTktMi4zNzIuOTQzLTMuNTM1IDEuMzM3QzEuOTMgMjIuOTk3IDEuMTI2IDIyLjE5My42MjYgMjEuMDMzYy40OTktMS4xNi45NDMtMi4zNzIgMS4zMzctMy41MzVDLjg5MiAxNy40MzYuMDkxIDE2LjYzMi0uMzQ1IDE1Ljc0MWMtLjQ5OS0xLjE2LS45NDMtMi4zNzItMS4zMzctMy41MzVDLS41NjQgMTAuNjM5LjI0IDkuODMzLjczMiA4LjY3M2MuNDk5LTEuMTYuOTQzLTIuMzcyIDEuMzM3LTMuNTM1QzEuOTMgNC4wMDMgMi43MzQgMy4xOTkgMy42MjYgMi43NjNjMS4xNi0uNDk5IDIuMzcyLS45NDMgMy41MzUtMS4zMzdDNy42OTYgLjQ5MiA4LjUgLS4zMTIgOS4zOTEgLS43NDhaIi8+PC9zdmc+',
  },
  {
    name: 'Red Heart',
    svg: 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2VmNDQ0NCIgc3Ryb2tlPSIjYjkxYzFjIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTQuMzE4IDYuMzE4YTQuNSA0LjUgMCAwMDAgNi4zNjRMMTIgMjAuMzY0bDcuNjg2LTcuNjg2YTQuNSA0LjUgMCAwMDAtNi4zNjRMNCA0LjNsLTMuMzY0IDMuMzY0YTRzMWMwIDEuMTQxLS4zMjQgMi4yMTktLjg4NCAzLjA4NlptLTcuNjg2LTcuNjg2YTRzMWMwLTEuMTQxLS4zMjQtMi4yMTktLjg4NC0zLjA4NlY0LjNMNy42ODYtNy42ODZ6Ii8+PC9zdmc+',
  },
  {
    name: 'Washi Tape',
    svg: 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMzAiIGZpbGw9IiNmY2E1YTVhYyI+PHBhdGggZD0iTTAgNWMwLTEgMS0yIDItMmg5NmMxIDAgMiAxIDIgMnYyMGMwIDEtMSAyLTIgMkgyaC0yYy0xIDAtMi0xLTItMlY1em0wIDV2MTBtMTAwLTEwdi0xbS0xMCAwdjEiIHN0cm9rZT0iI2Y4NzE3MSIgc3Ryb2tlLWRhc2hhcnJheT0iMSAxIi8+PC9zdmc+',
  }
];

export default function StickerPickerModal({ isOpen, onClose, onSelect }: StickerPickerModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="bg-white/90 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-2xl p-6 w-80 pointer-events-auto"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Add Sticker</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {STICKERS.map((sticker, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSelect(`data:image/svg+xml;base64,${sticker.svg}`);
                  onClose();
                }}
                className="aspect-square bg-gray-50 rounded-xl hover:bg-gray-100 border border-gray-200 flex items-center justify-center transition-all hover:scale-105 p-2"
                title={sticker.name}
              >
                <img src={`data:image/svg+xml;base64,${sticker.svg}`} alt={sticker.name} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

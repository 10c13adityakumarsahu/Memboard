import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Book } from '../api/books';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const navigate = useNavigate();

  // Use a default gradient if no cover image
  const bgStyle = book.cover_image
    ? { backgroundImage: `url(${book.cover_image})` }
    : { background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' };

  return (
    <motion.div
      onClick={() => navigate(`/editor/${book.id}`)}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group relative h-72 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      {/* Background Image / Color */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
        style={bgStyle}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <div className="flex justify-between items-start mb-2">
          <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white shadow-sm border border-white/20">
            {book.category}
          </span>
          <span className="text-white/80 text-xs">
            {new Date(book.created_at).toLocaleDateString()}
          </span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-1 leading-tight">{book.title}</h3>
        <p className="text-gray-200 text-sm line-clamp-2">{book.description}</p>
      </div>
    </motion.div>
  );
}

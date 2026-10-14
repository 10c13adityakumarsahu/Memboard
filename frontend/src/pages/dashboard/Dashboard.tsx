import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { useBooks } from '../../api/books';
import BookCard from '../../components/BookCard';
import CreateBookModal from '../../components/CreateBookModal';

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { data: books, isLoading, error } = useBooks();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">MemoryBook</h1>
            <p className="text-gray-500 mt-1">Preserve your favorite moments.</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 font-medium">Hello, {user?.username}</span>
            <button 
              onClick={handleLogout}
              className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
            >
              Sign Out
            </button>
          </div>
        </header>
        
        <main>
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-semibold text-gray-800">Your Books</h2>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-black text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-md"
            >
              + Create New Book
            </button>
          </div>

          {isLoading && (
            <div className="flex justify-center py-20">
              <div className="animate-pulse flex space-x-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl">
              Failed to load books. Please try again.
            </div>
          )}

          {books && books.length === 0 && !isLoading && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No books yet</h3>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">Create your first MemoryBook to start organizing and sharing your favorite moments.</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-lg"
              >
                Create Your First Book
              </button>
            </div>
          )}

          {books && books.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </main>
      </div>

      <CreateBookModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}

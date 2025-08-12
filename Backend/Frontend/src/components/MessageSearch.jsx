import React, { useState, useEffect, useRef } from 'react';
import { IoSearch, IoClose } from 'react-icons/io5';
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/md';

function MessageSearch({ messages, onResultClick, isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      setIsSearching(true);
      
      // Debounce search
      const timeoutId = setTimeout(() => {
        const results = messages.filter(message =>
          message.message.toLowerCase().includes(searchTerm.toLowerCase())
        ).map((message, index) => ({
          ...message,
          originalIndex: messages.findIndex(m => m._id === message._id)
        }));
        
        setSearchResults(results);
        setCurrentResultIndex(results.length > 0 ? 0 : -1);
        setIsSearching(false);
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
      setCurrentResultIndex(-1);
      setIsSearching(false);
    }
  }, [searchTerm, messages]);

  const navigateResults = (direction) => {
    if (searchResults.length === 0) return;
    
    let newIndex;
    if (direction === 'next') {
      newIndex = currentResultIndex + 1 >= searchResults.length ? 0 : currentResultIndex + 1;
    } else {
      newIndex = currentResultIndex - 1 < 0 ? searchResults.length - 1 : currentResultIndex - 1;
    }
    
    setCurrentResultIndex(newIndex);
    onResultClick(searchResults[newIndex]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults.length > 0) {
        onResultClick(searchResults[currentResultIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      navigateResults('next');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      navigateResults('prev');
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const highlightText = (text, term) => {
    if (!term) return text;
    
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-400 text-black px-1 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const formatDate = (date) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-b border-gray-700 z-50">
      <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
        {/* Search Input */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex-1 relative">
            <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-base sm:text-lg" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-10 pr-4 py-2 sm:py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-gray-750 text-sm sm:text-base"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-blue-500 border-t-transparent"></div>
              </div>
            )}
          </div>
          
          {/* Navigation buttons - responsive */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => navigateResults('prev')}
              disabled={searchResults.length === 0}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Previous result"
            >
              <MdKeyboardArrowUp className="text-base sm:text-lg" />
            </button>
            <button
              onClick={() => navigateResults('next')}
              disabled={searchResults.length === 0}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Next result"
            >
              <MdKeyboardArrowDown className="text-base sm:text-lg" />
            </button>
          </div>
          
          {/* Results counter - responsive text */}
          <div className="text-xs sm:text-sm text-gray-400 min-w-max hidden sm:block">
            {searchResults.length > 0 ? (
              `${currentResultIndex + 1} of ${searchResults.length}`
            ) : searchTerm ? (
              'No results'
            ) : (
              ''
            )}
          </div>
          
          {/* Mobile results counter */}
          <div className="text-xs text-gray-400 sm:hidden">
            {searchResults.length > 0 && (
              `${currentResultIndex + 1}/${searchResults.length}`
            )}
          </div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
            title="Close search"
          >
            <IoClose className="text-base sm:text-lg" />
          </button>
        </div>

        {/* Search Results Preview - Mobile optimized */}
        {searchTerm && searchResults.length > 0 && (
          <div className="max-h-32 sm:max-h-40 overflow-y-auto space-y-2 custom-scrollbar">
            {searchResults.slice(0, 5).map((result, index) => (
              <div
                key={result._id}
                onClick={() => onResultClick(result)}
                className={`p-2 sm:p-3 rounded-lg cursor-pointer transition-colors ${
                  index === currentResultIndex
                    ? 'bg-blue-600/30 border border-blue-500/50'
                    : 'bg-gray-800/50 hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs sm:text-sm break-words leading-relaxed">
                      {highlightText(result.message, searchTerm)}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      {formatDate(result.createdAt)}
                    </p>
                  </div>
                  {index === currentResultIndex && (
                    <div className="ml-2 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  )}
                </div>
              </div>
            ))}
            {searchResults.length > 5 && (
              <div className="text-center text-gray-400 text-xs sm:text-sm py-2">
                And {searchResults.length - 5} more results...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageSearch;

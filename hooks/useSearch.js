"use client";

import { createContext, useContext, useState, useCallback } from 'react';

const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchEvents = useCallback(async (query, events = [], useAPI = false) => {
    if (!query.trim()) {
      setSearchResults([]);
      return [];
    }

    setIsSearching(true);
    
    try {
      if (useAPI && events.length > 100) {
        // Use API search for large datasets
        const response = await fetch(`/api/events/search?q=${encodeURIComponent(query)}&limit=50`);
        const result = await response.json();
        
        if (result.success) {
          setSearchResults(result.data);
          return result.data;
        } else {
          throw new Error(result.error || 'Search failed');
        }
      } else {
        // Use client-side search for smaller datasets
        const searchTerm = query.toLowerCase().trim();
        
        const filteredEvents = events.filter(event => {
          const title = (event.title || '').toLowerCase();
          const description = (event.description || '').toLowerCase();
          const category = (event.category || '').toLowerCase();
          const venue = (event.venue || '').toLowerCase();
          const city = (event.city || '').toLowerCase();
          const eventType = (event.eventType || '').toLowerCase();
          const organizerName = (event.organizerName || '').toLowerCase();
          
          return (
            title.includes(searchTerm) ||
            description.includes(searchTerm) ||
            category.includes(searchTerm) ||
            venue.includes(searchTerm) ||
            city.includes(searchTerm) ||
            eventType.includes(searchTerm) ||
            organizerName.includes(searchTerm)
          );
        });

        setSearchResults(filteredEvents);
        return filteredEvents;
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      return [];
    } finally {
      setIsSearching(false);
    }
  }, []);

  const advancedSearch = useCallback(async (searchParams) => {
    const { query, category, dateRange, priceRange, eventType, limit = 50 } = searchParams;
    
    if (!query.trim()) {
      setSearchResults([]);
      return [];
    }

    setIsSearching(true);
    
    try {
      const response = await fetch('/api/events/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          category,
          dateRange,
          priceRange,
          eventType,
          limit
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setSearchResults(result.data);
        return result.data;
      } else {
        throw new Error(result.error || 'Advanced search failed');
      }
    } catch (error) {
      console.error('Advanced search error:', error);
      setSearchResults([]);
      return [];
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
  }, []);

  const value = {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    searchEvents,
    advancedSearch,
    clearSearch
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}

import React, { createContext, useContext, useState, useCallback } from 'react';

const SearchContext = createContext(null);

export const SearchProvider = ({ children }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const updateSearch = useCallback((value) => {
        setSearchQuery(value);
    }, []);

    const resetSearch = useCallback(() => {
        setSearchQuery('');
    }, []);

    return (
        <SearchContext.Provider value={{ searchQuery, setSearchQuery: updateSearch, resetSearch }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
};
import React, { memo, useRef, useEffect } from 'react';
import { Input } from 'antd';

const { Search } = Input;

export const SearchField = memo(({
    onSearch,
    placeholder = 'Поиск...',
    width = 300,
    allowClear = true,
}) => {
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    });

    const handleChange = (e) => {
        onSearch(e.target.value);
    };

    const handleClear = () => {
        onSearch('');
    };

    return (
        <Search
            ref={inputRef}
            placeholder={placeholder}
            allowClear={allowClear}
            onChange={handleChange}
            onClear={handleClear}
            style={{ width }}
        />
    );
});
import React from 'react';

export const SelectionCounter = ({ count }) => {
    return <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Выбрано: {count}</span>;
};
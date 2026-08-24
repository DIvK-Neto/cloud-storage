import React from 'react';
import { Link } from 'react-router-dom';

export const Logo = () => {
    return (
        <Link to="/" className="navbar-link" style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', textDecoration: 'none' }}>
            My Cloud
        </Link>
    );
};
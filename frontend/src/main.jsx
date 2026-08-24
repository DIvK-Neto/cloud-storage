import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider, SettingsProvider, TaskProvider } from './context/all_context';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <SettingsProvider>
        <TaskProvider>
          <App />
        </TaskProvider>
      </SettingsProvider>
    </AuthProvider>
  </React.StrictMode>
);
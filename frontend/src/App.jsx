import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { allRouting } from './routing/routing';
import { Navbar } from './components/all_components';
import { ProgressWidget } from './components/ui/ProgressWidget/collections/progressWidget';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className="App">
      <Navbar />
      <Routes>
        {allRouting.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
      {!isDashboard && <ProgressWidget />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
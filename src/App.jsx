import React from 'react';
import Header from './components/layout/Header';
import HomePage from './pages/HomePage';
import { CompareProvider } from './context/CompareContext';
import './App.css';

function App() {
  return (
    <CompareProvider>
      <div className="app-container">
        <Header />
        <HomePage />
      </div>
    </CompareProvider>
  );
}

export default App;

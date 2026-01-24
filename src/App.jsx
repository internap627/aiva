import React from 'react';
import Header from './components/layout/Header';
import HomePage from './pages/HomePage';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Header />
      <HomePage />
    </div>
  );
}

export default App;

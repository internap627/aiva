import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import HomePage from './pages/HomePage';
import ComparePage from './pages/ComparePage';
import CompareTray from './components/compare/CompareTray';
import { CompareProvider } from './context/CompareContext';
import './App.css';

function App() {
  return (
    <CompareProvider>
      <div className="app-container">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/compare" element={<ComparePage />} />
        </Routes>
        <CompareTray />
      </div>
    </CompareProvider>
  );
}

export default App;

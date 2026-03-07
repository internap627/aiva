import React from 'react';

const Loader = () => (
  <div className="loader-container">
    <div className="loader"></div>
    <p>Generating AI Recommendation...</p>
  </div>
);

const AIComparison = ({ recommendation, loading, error }) => {
  return (
    <div className="ai-recommendation">
      <h2>AI Recommendation</h2>
      {loading && <Loader />}
      {error && <p className="error-message">{error}</p>}
      {recommendation && !loading && <p className="recommendation-text">{recommendation}</p>}
    </div>
  );
};

export default AIComparison;

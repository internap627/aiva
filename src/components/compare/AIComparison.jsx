import React from 'react';

const Loader = () => (
  <div className="loader-container">
    <div className="loader"></div>
    <p>Generating AI recommendation...</p>
  </div>
);

const AIComparison = ({ recommendation, loading, error }) => {
  const bulletPoints = recommendation
    ? recommendation
        .split(/(?<=[.!?])\s+/)
        .map(point => point.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="ai-recommendation">
      <div className="result-panel">
        <span className="result-band">AI Result</span>
        <h3>Recommendation</h3>
        <ul className="ai-points">
          <li>Best for quick decision-making between the selected devices.</li>
        </ul>
      </div>
      {loading && <Loader />}
      {error && <p className="error-message">{error}</p>}
      {recommendation && !loading && (
        <div className="result-panel recommendation-text">
          <ul className="ai-points">
            {bulletPoints.map(point => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AIComparison;

import React from 'react';

const getPriceState = (valueScore) => {
  if (valueScore >= 70) {
    return {
      label: 'Underpriced',
      className: 'underpriced',
      note: 'Strong spec-to-price balance for this dataset.',
    };
  }

  if (valueScore >= 48) {
    return {
      label: 'Fair',
      className: 'fair',
      note: 'Price and hardware land in a balanced middle range.',
    };
  }

  return {
    label: 'Overpriced',
    className: 'overpriced',
    note: 'Price runs ahead of the value delivered by the scored specs.',
  };
};

const PriceEvaluationBadge = ({ device, scores }) => {
  const performanceScore = Math.round((scores.battery + scores.camera + scores.storage) / 3);
  const valueScore = Math.round((performanceScore + scores.price) / 2);
  const evaluation = getPriceState(valueScore);

  return (
    <div className="price-card">
      <div className="price-card-header">
        <div>
          <h3>{device.name}</h3>
          <p className="device-model">{device.model}</p>
        </div>
        <span className={`price-badge ${evaluation.className}`}>{evaluation.label}</span>
      </div>

      <div className="price-score-line">
        <span>Value Score</span>
        <span>{valueScore}/100</span>
      </div>
      <div className="price-score-track" aria-hidden="true">
        <div className="price-score-fill" style={{ width: `${valueScore}%` }} />
      </div>

      <ul className="price-notes">
        <li>{evaluation.note}</li>
        <li>Retail price: ${device.price}</li>
        <li>Performance index: {performanceScore}/100</li>
      </ul>
    </div>
  );
};

export default PriceEvaluationBadge;

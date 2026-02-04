import React from 'react';
import { Link } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';

const ComparePage = () => {
  const { compareList } = useCompare();

  if (compareList.length < 2) {
    return (
      <div className="compare-page">
        <h1>Please select two devices to compare</h1>
        <Link to="/">Go back to selection</Link>
      </div>
    );
  }

  const [device1, device2] = compareList;

  return (
    <div className="compare-page">
      <h1>{device1.name} vs {device2.name}</h1>
      <div className="comparison-content">
        {/* Placeholder for actual comparison content like RadarChart, AIComparison etc. */}
        <p>Comparison details will be shown here.</p>
      </div>
      <Link to="/">Go back</Link>
    </div>
  );
};

export default ComparePage;
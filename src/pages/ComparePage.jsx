import React from 'react';
import { Link } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import ComparisonTable from '../components/compare/ComparisonTable';

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

  const [deviceA, deviceB] = compareList;

  return (
    <div className="compare-page">
      <h1>{deviceA.name} vs {deviceB.name}</h1>
      <div className="comparison-content">
        <ComparisonTable deviceA={deviceA} deviceB={deviceB} />
      </div>
      <Link to="/">Go back</Link>
    </div>
  );
};

export default ComparePage;
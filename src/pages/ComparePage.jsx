import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import ComparisonTable from '../components/compare/ComparisonTable';
import RadarChart from '../components/compare/RadarChart';
import AIComparison from '../components/compare/AIComparison';
import { calculateScores } from '../utils/deviceUtils';
import { fetchAIRecommendation } from '../services/api';

const ComparePage = () => {
  const { compareList } = useCompare();
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (compareList.length === 2) {
      const getRecommendation = async () => {
        try {
          setLoading(true);
          const result = await fetchAIRecommendation(compareList[0], compareList[1]);
          setRecommendation(result);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      getRecommendation();
    }
  }, [compareList]);

  if (compareList.length < 2) {
    return (
      <div className="compare-page">
        <h1>Please select two devices to compare</h1>
        <Link to="/">Go back to selection</Link>
      </div>
    );
  }

  const [deviceA, deviceB] = compareList;
  const scoresA = calculateScores(deviceA);
  const scoresB = calculateScores(deviceB);

  return (
    <div className="compare-page">
      <h1>{deviceA.name} vs {deviceB.name}</h1>
      <div className="comparison-content">
        <ComparisonTable deviceA={deviceA} deviceB={deviceB} />
      </div>
      <div className="chart-container">
        <h2>Performance Radar</h2>
        <RadarChart scoresA={scoresA} scoresB={scoresB} nameA={deviceA.name} nameB={deviceB.name} />
      </div>
      <AIComparison recommendation={recommendation} loading={loading} error={error} />
      <Link to="/">Go back</Link>
    </div>
  );
};

export default ComparePage;
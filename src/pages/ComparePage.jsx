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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isComparisonStarted, setIsComparisonStarted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFetchRecommendation = async () => {
    if (compareList.length === 2) {
      setIsComparisonStarted(true);
      try {
        setLoading(true);
        const result = await fetchAIRecommendation(compareList[0], compareList[1]);
        setRecommendation(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

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
      
      <div className="compare-section">
        <ComparisonTable deviceA={deviceA} deviceB={deviceB} />
      </div>

      <div className="compare-section">
        <h2>Performance Radar</h2>
        <RadarChart scoresA={scoresA} scoresB={scoresB} nameA={deviceA.name} nameB={deviceB.name} />
      </div>
      
      {isComparisonStarted ? (
        <div className="compare-section">
          <AIComparison recommendation={recommendation} loading={loading} error={error} />
        </div>
      ) : (
        <div className="compare-section ai-recommendation-start">
          <h2>AI-Powered Comparison</h2>
          <p>Let our AI analyze these devices and give you a head-to-head summary.</p>
          <button onClick={handleFetchRecommendation} className="cta-button">
            Get AI Comparison
          </button>
        </div>
      )}

      <Link to="/">Go back</Link>
    </div>
  );
};

export default ComparePage;
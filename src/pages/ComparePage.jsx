import React, { useState, useEffect, useRef } from 'react';
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
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPreparingPdf, setIsPreparingPdf] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  const comparisonRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const handleFetchRecommendation = async () => {
    setIsComparisonStarted(true);
    setError(null);

    try {
      setLoading(true);
      const result = await fetchAIRecommendation(deviceA, deviceB);
      setRecommendation(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadComparison = async () => {
    if (!comparisonRef.current) {
      return;
    }

    setDownloadError(null);
    setIsDownloading(true);
    setIsPreparingPdf(true);

    try {
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

      const { default: html2pdf } = await import('html2pdf.js');
      const baseFilename = `${deviceA.name}-vs-${deviceB.name}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      await html2pdf()
        .set({
          filename: `${baseFilename || 'device-comparison'}.pdf`,
          margin: [0.4, 0.4],
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: '#f8f9fa',
          },
          jsPDF: {
            unit: 'in',
            format: 'letter',
            orientation: 'portrait',
          },
          pagebreak: {
            mode: ['css', 'legacy'],
          },
        })
        .from(comparisonRef.current)
        .save();
    } catch (err) {
      setDownloadError(err.message || 'Unable to download the comparison right now.');
    } finally {
      setIsPreparingPdf(false);
      setIsDownloading(false);
    }
  };

  return (
    <div className="compare-page">
      <div className="compare-page-header">
        <h1>{deviceA.name} vs {deviceB.name}</h1>
        <button
          onClick={handleDownloadComparison}
          className="cta-button download-button"
          disabled={isDownloading}
        >
          {isDownloading ? 'Preparing PDF...' : 'Download Comparison'}
        </button>
      </div>

      {downloadError && <p className="error-message compare-download-error">{downloadError}</p>}

      <div
        ref={comparisonRef}
        className={`comparison-export${isPreparingPdf ? ' pdf-export' : ''}`}
      >
        <div className="compare-section">
          <ComparisonTable deviceA={deviceA} deviceB={deviceB} />
        </div>

        <div className="compare-section radar-section">
          <h2>Performance Radar</h2>
          <RadarChart
            scoresA={scoresA}
            scoresB={scoresB}
            nameA={deviceA.name}
            nameB={deviceB.name}
            height={isPreparingPdf ? 300 : 400}
            compact={isPreparingPdf}
          />
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
      </div>

      <Link to="/">Go back</Link>
    </div>
  );
};

export default ComparePage;

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import ComparisonTable from '../components/compare/ComparisonTable';
import RadarChart from '../components/compare/RadarChart';
import AIComparison from '../components/compare/AIComparison';
import { calculateScores } from '../utils/deviceUtils';
import { fetchAIRecommendation } from '../services/api';

const ComparePage = () => {
  const {
    compareList,
    isAiCompareRateLimited,
    compareCooldownSeconds,
    recordAiCompareRequest,
  } = useCompare();
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isComparisonStarted, setIsComparisonStarted] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPreparingPdf, setIsPreparingPdf] = useState(false);
  const [isSharingToX, setIsSharingToX] = useState(false);
  const [isPreparingShare, setIsPreparingShare] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  const [shareError, setShareError] = useState(null);
  const [shareStatus, setShareStatus] = useState('');
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
  const isPreparingExport = isPreparingPdf || isPreparingShare;

  const createExportBaseFilename = () =>
    `${deviceA.name}-vs-${deviceB.name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

  const buildShareText = () => {
    const totalA = Object.values(scoresA).reduce((sum, value) => sum + value, 0);
    const totalB = Object.values(scoresB).reduce((sum, value) => sum + value, 0);
    const winnerText = totalA === totalB
      ? 'This one is too close to call.'
      : `${totalA > totalB ? deviceA.name : deviceB.name} edges ahead overall.`;

    return [
      `Comparing ${deviceA.name} vs ${deviceB.name} on AIVA.`,
      winnerText,
      `Price: $${deviceA.price} vs $${deviceB.price}.`,
      `Battery: ${deviceA.battery}mAh vs ${deviceB.battery}mAh.`,
      '#AIVA #Tech',
    ].join(' ');
  };

  const downloadBlob = (blob, fileName) => {
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(objectUrl);
  };

  const handleFetchRecommendation = async () => {
    if (isAiCompareRateLimited) {
      setError(`Too many AI comparisons. Please wait ${compareCooldownSeconds}s and try again.`);
      return;
    }

    setIsComparisonStarted(true);
    setError(null);
    recordAiCompareRequest();

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
      const baseFilename = createExportBaseFilename();

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

  const handleShareToX = async () => {
    if (!comparisonRef.current) {
      return;
    }

    const shareWindow = window.open('', '_blank');

    setShareError(null);
    setShareStatus('');
    setIsSharingToX(true);
    setIsPreparingShare(true);

    try {
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

      const { toBlob } = await import('html-to-image');
      const imageBlob = await toBlob(comparisonRef.current, {
        cacheBust: true,
        backgroundColor: '#f8f9fa',
        pixelRatio: 2,
      });

      if (!imageBlob) {
        throw new Error('Unable to create the share image right now.');
      }

      const shareText = buildShareText();
      const baseFilename = createExportBaseFilename();
      const shareUrl = new URL('https://twitter.com/intent/tweet');
      shareUrl.searchParams.set('text', shareText);

      downloadBlob(imageBlob, `${baseFilename || 'device-comparison'}-share.png`);

      let copiedText = false;
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(shareText);
          copiedText = true;
        } catch {
          copiedText = false;
        }
      }

      if (shareWindow) {
        shareWindow.location.href = shareUrl.toString();
      } else {
        window.open(shareUrl.toString(), '_blank', 'noopener,noreferrer');
      }

      setShareStatus(
        copiedText
          ? 'X composer opened, share text copied, and the image was downloaded for attachment.'
          : 'X composer opened and the image was downloaded for attachment.'
      );
    } catch (err) {
      if (shareWindow) {
        shareWindow.close();
      }
      setShareError(err.message || 'Unable to prepare the X share right now.');
    } finally {
      setIsPreparingShare(false);
      setIsSharingToX(false);
    }
  };

  return (
    <div className="compare-page">
      <div className="compare-page-header">
        <h1>{deviceA.name} vs {deviceB.name}</h1>
        <div className="compare-page-actions">
          <button
            onClick={handleDownloadComparison}
            className="cta-button download-button"
            disabled={isDownloading || isSharingToX}
          >
            {isDownloading ? 'Preparing PDF...' : 'Download Comparison'}
          </button>
          <button
            onClick={handleShareToX}
            className="cta-button share-button"
            disabled={isDownloading || isSharingToX}
          >
            {isSharingToX ? 'Preparing X Share...' : 'Share to X'}
          </button>
        </div>
      </div>

      {downloadError && <p className="error-message compare-download-error">{downloadError}</p>}
      {shareError && <p className="error-message compare-download-error">{shareError}</p>}
      {shareStatus && <p className="share-status-message">{shareStatus}</p>}

      <div
        ref={comparisonRef}
        className={`comparison-export${isPreparingExport ? ' pdf-export' : ''}${isPreparingShare ? ' social-export' : ''}`}
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
            height={isPreparingExport ? 300 : 400}
            compact={isPreparingExport}
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
            {isAiCompareRateLimited && (
              <p className="compare-limit-message compare-page-limit-message">
                AI comparison limit reached. Please wait {compareCooldownSeconds}s before trying again.
              </p>
            )}
            <button
              onClick={handleFetchRecommendation}
              className="cta-button"
              disabled={loading || isAiCompareRateLimited}
            >
              {isAiCompareRateLimited ? `Wait ${compareCooldownSeconds}s` : 'Get AI Comparison'}
            </button>
          </div>
        )}
      </div>

      <Link to="/">Go back</Link>
    </div>
  );
};

export default ComparePage;

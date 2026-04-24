import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import ComparisonTable from '../components/compare/ComparisonTable';
import RadarChart from '../components/compare/RadarChart';
import AIComparison from '../components/compare/AIComparison';
import PriceEvaluationBadge from '../components/compare/PriceEvaluationBadge';
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
        <div className="hero-card compare-empty-state">
          <p className="hero-eyebrow">Comparison Needed</p>
          <h1>Select Two Devices</h1>
          <ul className="hero-points">
            <li>Pick any two phones from the selection grid.</li>
            <li>Use the floating tray to open the comparison view.</li>
          </ul>
          <Link to="/" className="back-link">Go back to selection</Link>
        </div>
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

  const getLeadingDevice = () => {
    const totalA = Object.values(scoresA).reduce((sum, value) => sum + value, 0);
    const totalB = Object.values(scoresB).reduce((sum, value) => sum + value, 0);

    if (totalA === totalB) {
      return 'Even matchup';
    }

    return totalA > totalB ? deviceA.name : deviceB.name;
  };

  const buildOverviewSpecs = (device) => [
    { label: 'Price', value: `$${device.price}` },
    { label: 'Battery', value: `${device.battery} mAh` },
    { label: 'Camera', value: `${device.camera} MP` },
    { label: 'Storage', value: `${device.storage} GB` },
  ];

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
        <ul className="section-points">
          <li>Read the side-by-side overview first, then use the radar for visual balance.</li>
          <li>Run the AI summary for a short recommendation and scan the price insight badges last.</li>
        </ul>
      </div>

      <div className="compare-feedback">
        {downloadError && <p className="error-message compare-download-error">{downloadError}</p>}
        {shareError && <p className="error-message compare-download-error">{shareError}</p>}
        {shareStatus && <p className="share-status-message">{shareStatus}</p>}
      </div>

      <div
        ref={comparisonRef}
        className={`comparison-export${isPreparingExport ? ' pdf-export' : ''}${isPreparingShare ? ' social-export' : ''}`}
      >
        <section className="poster-card">
          <div className="card-header">
            <h2>Section 1: Comparison Overview</h2>
          </div>
          <div className="card-body">
            <p className="section-kicker">Device A vs Device B</p>
            <ul className="section-points">
              <li>Current edge: {getLeadingDevice()}.</li>
              <li>Use these summary cards for the fastest side-by-side read.</li>
            </ul>

            <div className="comparison-overview-grid">
              {[deviceA, deviceB].map((device, index) => (
                <article key={device.id} className="overview-card">
                  <div className="overview-card-header">
                    <div>
                      <h3>{index === 0 ? 'Device A' : 'Device B'}</h3>
                      <p>{device.name}</p>
                      <p className="device-model">{device.model}</p>
                    </div>
                    <span className="score-chip">
                      Score {Math.round(Object.values(index === 0 ? scoresA : scoresB).reduce((sum, value) => sum + value, 0) / 4)}
                    </span>
                  </div>
                  <div className="quick-spec-grid">
                    {buildOverviewSpecs(device).map((spec) => (
                      <div key={spec.label} className="quick-spec">
                        <span className="quick-spec-label">{spec.label}</span>
                        <span className="quick-spec-value">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <div className="visual-card table-card">
              <h3>Detailed Spec Breakdown</h3>
              <ComparisonTable deviceA={deviceA} deviceB={deviceB} />
            </div>
          </div>
        </section>

        <section className="poster-card radar-section">
          <div className="card-header">
            <h2>Section 2: Visual Comparison</h2>
          </div>
          <div className="card-body">
            <div className="visual-card">
              <div className="visual-card-copy">
                <h3>Performance Radar</h3>
                <ul className="section-points">
                  <li>The wider shape usually signals stronger balance across key specs.</li>
                  <li>Light blue and dark blue keep the comparison readable in screenshots.</li>
                </ul>
              </div>
              <RadarChart
                scoresA={scoresA}
                scoresB={scoresB}
                nameA={deviceA.name}
                nameB={deviceB.name}
                height={isPreparingExport ? 340 : 400}
                compact={isPreparingExport}
              />
            </div>
          </div>
        </section>

        <section className="poster-card">
          <div className="card-header">
            <h2>Section 3: AI Insight</h2>
          </div>
          <div className="card-body section-stack">
            {isComparisonStarted ? (
              <AIComparison recommendation={recommendation} loading={loading} error={error} />
            ) : (
              <div className="ai-recommendation-start">
                <p className="section-kicker">Result Card</p>
                <ul className="section-points">
                  <li>Generate a short recommendation focused on typical user value.</li>
                  <li>The response is formatted for quick scanning rather than dense reading.</li>
                </ul>
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
        </section>

        <section className="poster-card">
          <div className="card-header">
            <h2>Section 4: Price Insight</h2>
          </div>
          <div className="card-body">
            <p className="section-kicker">Value Read</p>
            <ul className="section-points">
              <li>Badges show whether each device looks underpriced, fair, or overpriced.</li>
              <li>The score blends normalized performance and price-friendliness.</li>
            </ul>
            <div className="price-insight-grid">
              <PriceEvaluationBadge device={deviceA} scores={scoresA} />
              <PriceEvaluationBadge device={deviceB} scores={scoresB} />
            </div>
          </div>
        </section>
      </div>

      <div className="compare-page-footer">
        <Link to="/" className="back-link">Go back</Link>
      </div>
    </div>
  );
};

export default ComparePage;

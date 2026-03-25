import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompare } from '../../context/CompareContext';

const CompareTray = () => {
  const { compareList, removeFromCompare, isAiCompareRateLimited, compareCooldownSeconds } = useCompare();
  const navigate = useNavigate();

  const handleCompare = () => {
    navigate('/compare');
  };

  const isVisible = compareList.length > 0;

  return (
    <div className={`compare-tray ${isVisible ? 'visible' : ''}`}>
      <div className="tray-items">
        {compareList.map(device => (
          <div key={device.id} className="tray-item">
            <span>{device.name}</span>
            <button onClick={() => removeFromCompare(device.id)} className="remove-item-btn">
              &times;
            </button>
          </div>
        ))}
         {compareList.length < 2 && (
          <div className="tray-placeholder">
            {compareList.length === 0 ? 'Select up to 2 devices to compare' : 'Select 1 more device'}
          </div>
        )}
      </div>
      <div className="compare-tray-actions">
        {isAiCompareRateLimited && (
          <p className="compare-limit-message">
            AI comparison cooldown: wait {compareCooldownSeconds}s.
          </p>
        )}
        <button
          onClick={handleCompare}
          disabled={compareList.length !== 2 || isAiCompareRateLimited}
          className="compare-now-btn"
        >
          {isAiCompareRateLimited ? `Wait ${compareCooldownSeconds}s` : 'Compare Now'}
        </button>
      </div>
    </div>
  );
};

export default CompareTray;

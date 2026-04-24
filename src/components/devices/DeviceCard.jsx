import React from 'react';
import { useCompare } from '../../context/CompareContext';

const DeviceCard = ({ device }) => {
  const { compareList, addToCompare } = useCompare();
  
  const isSelected = compareList.find(d => d.id === device.id);
  const isFull = compareList.length >= 2;
  const disabled = isFull && !isSelected;

  return (
    <div className={`device-card${isSelected ? ' is-selected' : ''}`}>
      <div className="device-image-shell">
        <img src={device.image} alt={device.name} className="device-image" />
      </div>
      <div className="device-info">
        <div className="device-name-row">
          <div>
            <h3>{device.name}</h3>
            <p className="device-model">{device.model}</p>
          </div>
          <span className="device-price-chip">${device.price}</span>
        </div>
        <ul className="device-highlights">
          <li><strong>Battery:</strong> {device.battery} mAh</li>
          <li><strong>Camera:</strong> {device.camera} MP</li>
          <li><strong>Storage:</strong> {device.storage} GB</li>
        </ul>
        <button onClick={() => addToCompare(device)} disabled={disabled || isSelected} className="compare-button">
          {isSelected ? 'Added' : 'Add to Compare'}
        </button>
      </div>
    </div>
  );
};

export default DeviceCard;

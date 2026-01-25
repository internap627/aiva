import React from 'react';
import { useCompare } from '../../context/CompareContext';

const DeviceCard = ({ device }) => {
  const { compareList, addToCompare } = useCompare();
  
  const isSelected = compareList.find(d => d.id === device.id);
  const isFull = compareList.length >= 2;
  const disabled = isFull && !isSelected;

  return (
    <div className="device-card">
      <img src={device.image} alt={device.name} className="device-image" />
      <div className="device-info">
        <h3>{device.name}</h3>
        <p className="device-model">{device.model}</p>
        <div className="device-specs">
          <p><strong>Price:</strong> ${device.price}</p>
          <p><strong>Battery:</strong> {device.battery} mAh</p>
          <p><strong>Camera:</strong> {device.camera} MP</p>
          <p><strong>Storage:</strong> {device.storage} GB</p>
        </div>
        <button onClick={() => addToCompare(device)} disabled={disabled || isSelected} className="compare-button">
          {isSelected ? 'Added' : 'Add to Compare'}
        </button>
      </div>
    </div>
  );
};

export default DeviceCard;
import React from 'react';

const DeviceCard = ({ device, onAddToCompare, disabled }) => {
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
        <button onClick={() => onAddToCompare(device)} disabled={disabled} className="compare-button">
          {disabled ? 'Added' : 'Add to Compare'}
        </button>
      </div>
    </div>
  );
};

export default DeviceCard;
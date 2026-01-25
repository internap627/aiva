import React from 'react';
import DeviceCard from "./DeviceCard";

function DeviceGrid({ devices }) {
  return (
    <div className="device-grid">
      {devices.map(device => (
        <DeviceCard
          key={device.id}
          device={device}
        />
      ))}
    </div>
  );
}

export default DeviceGrid;

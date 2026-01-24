import React from 'react';
import DeviceCard from "./DeviceCard";

function DeviceGrid({ devices, onAddToCompare, selectedDevices }) {
  return (
    <div className="device-grid">
      {devices.map(device => (
        <DeviceCard
          key={device.id}
          device={device}
          onAddToCompare={onAddToCompare}
          disabled={selectedDevices.length >= 2 || selectedDevices.find(d => d.id === device.id)}
        />
      ))}
    </div>
  );
}

export default DeviceGrid;

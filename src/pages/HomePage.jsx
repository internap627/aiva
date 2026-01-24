import React, { useState } from 'react';
import devices from "../data/devices.json";
import DeviceGrid from "../components/devices/DeviceGrid";

function HomePage() {
  const [compareList, setCompareList] = useState([]);

  const handleAddToCompare = (device) => {
    setCompareList(prevList => {
      if (prevList.find(d => d.id === device.id)) {
        return prevList; // Already in list
      }
      if (prevList.length < 2) {
        return [...prevList, device];
      }
      return prevList; // List is full
    });
  };

  return (
    <main className="homepage">
      <h1 className="homepage-title">Choose Devices to Compare</h1>
      <DeviceGrid 
        devices={devices} 
        onAddToCompare={handleAddToCompare}
        selectedDevices={compareList}
      />
    </main>
  );
}

export default HomePage;

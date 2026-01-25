import React from 'react';
import devices from "../data/devices.json";
import DeviceGrid from "../components/devices/DeviceGrid";

function HomePage() {
  return (
    <main className="homepage">
      <h1 className="homepage-title">Choose Devices to Compare</h1>
      <DeviceGrid devices={devices} />
    </main>
  );
}

export default HomePage;

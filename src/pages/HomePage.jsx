import React, { useState, useMemo } from 'react';
import devices from "../data/devices.json";
import DeviceGrid from "../components/devices/DeviceGrid";
import SearchBar from '../components/search/SearchBar';
import FilterPanel from '../components/search/FilterPanel';

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    price: '',
    storage: '',
    camera: '',
  });

  const filteredDevices = useMemo(() => {
    return devices.filter(device => {
      // Search query filter
      const searchMatch = device.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Price filter
      let priceMatch = true;
      if (filters.price) {
        const [minPrice, maxPrice] = filters.price.split('-').map(Number);
        priceMatch = device.price >= minPrice && device.price <= (maxPrice || Infinity);
      }

      // Storage filter
      let storageMatch = true;
      if (filters.storage) {
        storageMatch = device.storage >= parseInt(filters.storage, 10);
      }

      // Camera filter
      let cameraMatch = true;
      if (filters.camera) {
        cameraMatch = device.camera >= parseInt(filters.camera, 10);
      }

      return searchMatch && priceMatch && storageMatch && cameraMatch;
    });
  }, [searchQuery, filters]);

  return (
    <main className="homepage">
      <section className="hero-card">
        <p className="hero-eyebrow">AI Device Matchups</p>
        <h1 className="homepage-title">AIVA</h1>
        <p className="hero-tagline">Compare phones faster, with cleaner signals and clearer decisions.</p>
        <ul className="hero-points">
          <li>Pick any two devices for a direct side-by-side review.</li>
          <li>Use filters to narrow by price, storage, or camera strength.</li>
          <li>Open the compare page for radar visuals, AI insight, and price value tags.</li>
        </ul>
      </section>

      <section className="poster-card">
        <div className="card-header">
          <h2>Device Selection</h2>
        </div>
        <div className="card-body device-selection-layout">
          <p className="section-kicker">Build Your Comparison</p>
          <ul className="section-points">
            <li>Select up to two devices from the grid.</li>
            <li>Use the floating tray to jump straight into the comparison view.</li>
          </ul>

          <div className="search-and-filter-container">
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <FilterPanel filters={filters} setFilters={setFilters} devices={devices} />
          </div>
          <DeviceGrid devices={filteredDevices} />
        </div>
      </section>
    </main>
  );
}

export default HomePage;

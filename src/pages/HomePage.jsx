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
      <div className="homepage-header">
        <h1 className="homepage-title">Choose Devices to Compare</h1>
        <p className="homepage-subtitle">
          Select up to two devices from the list below to see a side-by-side comparison.
        </p>
      </div>
      <div className="search-and-filter-container">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <FilterPanel filters={filters} setFilters={setFilters} devices={devices} />
      </div>
      <DeviceGrid devices={filteredDevices} />
    </main>
  );
}

export default HomePage;

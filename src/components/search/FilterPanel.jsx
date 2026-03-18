import React from 'react';

const FilterPanel = ({ filters, setFilters, devices }) => {
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      price: '',
      storage: '',
      camera: '',
    });
  };

  return (
    <div className="filter-panel">
      <div className="filter-group">
        <select name="price" value={filters.price} onChange={handleFilterChange} className="filter-select">
          <option value="">All Prices</option>
          <option value="0-499">Under $500</option>
          <option value="500-999">$500 - $999</option>
          <option value="1000-Infinity">$1000+</option>
        </select>
        <select name="storage" value={filters.storage} onChange={handleFilterChange} className="filter-select">
          <option value="">All Storage</option>
          <option value="128">128 GB</option>
          <option value="256">256 GB</option>
        </select>
        <select name="camera" value={filters.camera} onChange={handleFilterChange} className="filter-select">
          <option value="">All Cameras</option>
          <option value="12">12 MP+</option>
          <option value="48">48 MP+</option>
          <option value="100">100 MP+</option>
        </select>
      </div>
      <button onClick={resetFilters} className="reset-filters-btn">Reset Filters</button>
    </div>
  );
};

export default FilterPanel;

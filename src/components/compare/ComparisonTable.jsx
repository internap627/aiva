import React from 'react';
import { getBrand } from '../../utils/deviceUtils';

const specs = {
  '📱 General': [
    { key: 'brand', label: 'Brand', higherIsBetter: false },
    { key: 'price', label: 'Price', unit: '$', higherIsBetter: false },
  ],
  '⚡ Performance': [
    { key: 'storage', label: 'Storage', unit: 'GB', higherIsBetter: true },
  ],
  '🔋 Battery': [
    { key: 'battery', label: 'Capacity', unit: 'mAh', higherIsBetter: true },
  ],
  '📸 Camera': [
    { key: 'camera', label: 'Main Camera', unit: 'MP', higherIsBetter: true },
  ],
};

const ComparisonTable = ({ deviceA, deviceB }) => {
  const getSpecValue = (device, specKey) => {
    if (specKey === 'brand') {
      return getBrand(device.name);
    }
    return device[specKey];
  };

  const getBetterSpec = (spec, valueA, valueB) => {
    if (spec.higherIsBetter === null || valueA === valueB) return null;
    if (spec.higherIsBetter) {
      return valueA > valueB ? 'a' : 'b';
    }
    return valueA < valueB ? 'a' : 'b';
  };

  return (
    <table className="comparison-table">
      <thead>
        <tr>
          <th>Specification</th>
          <th>{deviceA.name}</th>
          <th>{deviceB.name}</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(specs).map(([group, specItems]) => (
          <React.Fragment key={group}>
            <tr className="spec-group-header">
              <td colSpan="3">{group}</td>
            </tr>
            {specItems.map(spec => {
              const valueA = getSpecValue(deviceA, spec.key);
              const valueB = getSpecValue(deviceB, spec.key);
              const better = getBetterSpec(spec, deviceA[spec.key], deviceB[spec.key]);

              return (
                <tr key={spec.key}>
                  <td className="spec-label">{spec.label}</td>
                  <td className={`spec-value ${better === 'a' ? 'highlight' : ''}`}>
                    {valueA} {spec.unit}
                  </td>
                  <td className={`spec-value ${better === 'b' ? 'highlight' : ''}`}>
                    {valueB} {spec.unit}
                  </td>
                </tr>
              );
            })}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default ComparisonTable;

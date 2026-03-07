import allDevices from '../data/devices.json';

export const getBrand = (deviceName) => {
  const brands = ['iPhone', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Sony', 'Motorola', 'Nothing', 'Huawei'];
  const name = deviceName.toLowerCase();
  for (const brand of brands) {
    if (name.includes(brand.toLowerCase())) {
        if (brand === 'iPhone') return 'Apple';
      return brand;
    }
  }
  return 'Unknown';
};

const getMinMax = (key) => {
  const values = allDevices.map(d => d[key]);
  return { min: Math.min(...values), max: Math.max(...values) };
};

const normalize = (value, min, max, higherIsBetter = true) => {
  const score = ((value - min) / (max - min)) * 100;
  return higherIsBetter ? score : 100 - score;
};

export const calculateScores = (device) => {
  const specsToScore = ['price', 'battery', 'camera', 'storage'];
  const scores = {};

  specsToScore.forEach(spec => {
    const { min, max } = getMinMax(spec);
    const higherIsBetter = spec !== 'price';
    scores[spec] = normalize(device[spec], min, max, higherIsBetter);
  });

  return scores;
};

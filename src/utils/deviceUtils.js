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

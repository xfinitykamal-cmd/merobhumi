/**
 * Transform the new frontend's AI search request format to the backend format.
 *
 * Frontend sends:
 *   { city, price: { min, max }, type, category }
 *
 * Backend expects:
 *   { city, maxPrice (in Crores string), propertyType, propertyCategory, limit }
 */
export const transformAISearchRequest = (req, res, next) => {
  const { city, price, type, category } = req.body;

  // Convert price from absolute INR to Crores (1 Cr = 1,00,00,000)
  let maxPriceInCr = '5'; // sensible default
  if (price?.max) {
    maxPriceInCr = (price.max / 10000000).toFixed(1);
  }

  // Map frontend "type" values to backend property types
  const typeMap = {
    Modern: 'Flat',
    Flat: 'Flat',
    Apartment: 'Flat',
    Villa: 'House',
    House: 'House',
    Independent: 'House',
    Commercial: 'Commercial',
  };

  req.body = {
    city: city || req.body.city,
    maxPrice: maxPriceInCr,
    propertyType: typeMap[type] || type || 'Flat',
    propertyCategory: category || 'Residential',
    limit: 6,
  };

  next();
};

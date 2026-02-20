// Mock firecrawl service to prevent server crash
const firecrawlService = {
    findProperties: async (city, maxPrice, propertyCategory, propertyType, limit) => {
        console.log(`[Mock Firecrawl] Searching in ${city}...`);
        return { properties: [] };
    },
    getLocationTrends: async (city, limit) => {
        console.log(`[Mock Firecrawl] Fetching trends for ${city}...`);
        return { locations: [] };
    }
};

export default firecrawlService;

import firecrawlService from '../services/firecrawlService.js';
import aiService from '../services/aiService.js';
import { validateAndFixPropertyAnalysis, validateAndFixLocationAnalysis } from '../utils/validateAIResponse.js';

export const searchProperties = async (req, res) => {
    try {
        const { city, maxPrice, propertyCategory, propertyType, limit = 6 } = req.body;

        // Input validation
        if (!city || !maxPrice) {
            return res.status(400).json({ success: false, message: 'City and maxPrice are required' });
        }

        // Step 1: Firecrawl — isolated try-catch so AI can still run on failure
        let propertiesData;
        try {
            propertiesData = await firecrawlService.findProperties(
                city,
                maxPrice,
                propertyCategory || 'Residential',
                propertyType || 'Flat',
                Math.min(limit, 6)
            );
        } catch (firecrawlError) {
            console.error('[Firecrawl] Property search failed:', firecrawlError.message);
            return res.status(503).json({
                success: false,
                message: 'Property search service temporarily unavailable. Please try again later.',
                error: 'FIRECRAWL_ERROR'
            });
        }

        // Step 2: Handle empty results
        if (!propertiesData?.properties || propertiesData.properties.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No properties found in ${city} within the given budget`,
                properties: [],
                analysis: null
            });
        }

        // Step 3: AI analysis — isolated so properties still return on AI failure
        let analysis;
        try {
            const rawAnalysis = await aiService.analyzeProperties(
                propertiesData.properties,
                city,
                maxPrice,
                propertyCategory || 'Residential',
                propertyType || 'Flat'
            );
            // Validate and fix the AI JSON response
            analysis = validateAndFixPropertyAnalysis(rawAnalysis, propertiesData.properties);
        } catch (aiError) {
            console.error('[AI] Property analysis failed:', aiError.message);
            // Build a safe fallback from scraped data
            analysis = {
                error: 'Analysis temporarily unavailable',
                overview: propertiesData.properties.slice(0, 3).map(p => ({
                    name: p.building_name || 'Unknown',
                    price: p.price || 'Contact for price',
                    area: p.area_sqft || 'N/A',
                    location: p.location_address || '',
                    highlight: 'Property details available'
                })),
                best_value: null,
                recommendations: ['Contact us for more details']
            };
        }

        res.json({
            success: true,
            properties: propertiesData.properties,
            analysis
        });
    } catch (error) {
        console.error('Error searching properties:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search properties',
            error: error.message
        });
    }
};

export const getLocationTrends = async (req, res) => {
    try {
        const { city } = req.params;
        const { limit = 5 } = req.query;

        if (!city) {
            return res.status(400).json({ success: false, message: 'City parameter is required' });
        }

        // Step 1: Firecrawl — isolated try-catch
        let locationsData;
        try {
            locationsData = await firecrawlService.getLocationTrends(city, Math.min(limit, 5));
        } catch (firecrawlError) {
            console.error('[Firecrawl] Location trends failed:', firecrawlError.message);
            return res.status(503).json({
                success: false,
                message: 'Location trends service temporarily unavailable. Please try again later.',
                error: 'FIRECRAWL_ERROR'
            });
        }

        // Step 2: Handle empty results
        if (!locationsData?.locations || locationsData.locations.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No location trend data found for ${city}`,
                locations: [],
                analysis: null
            });
        }

        // Step 3: AI analysis — isolated
        let analysis;
        try {
            const rawAnalysis = await aiService.analyzeLocationTrends(
                locationsData.locations,
                city
            );
            analysis = validateAndFixLocationAnalysis(rawAnalysis);
        } catch (aiError) {
            console.error('[AI] Location analysis failed:', aiError.message);
            analysis = {
                error: 'Analysis temporarily unavailable',
                trends: [],
                top_appreciation: null,
                best_rental_yield: null,
                investment_tips: ['Contact us for personalized investment advice']
            };
        }

        res.json({
            success: true,
            locations: locationsData.locations,
            analysis
        });
    } catch (error) {
        console.error('Error getting location trends:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get location trends',
            error: error.message
        });
    }
};
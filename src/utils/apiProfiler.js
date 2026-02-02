/**
 * Detects the API version from a URL string.
 * @param {string} url 
 * @returns {string|null}
 */
export const detectVersion = (url) => {
    const versionMatch = url.match(/\/(v\d+)\/|(\/v\d+$)/i);
    return versionMatch ? versionMatch[1] || versionMatch[2] : null;
};

/**
 * Normalizes headers for easier analysis.
 * @param {Object} headers 
 * @returns {Object}
 */
const normalizeHeaders = (headers) => {
    const normalized = {};
    Object.keys(headers).forEach(key => {
        normalized[key.toLowerCase()] = headers[key];
    });
    return normalized;
};

/**
 * Profiles an API response to detect characteristics and boundaries.
 * @param {string} url 
 * @param {Object} response 
 * @returns {Object}
 */
export const profileApi = (url, response) => {
    const headers = normalizeHeaders(response.headers || {});
    const status = response.status;

    const profile = {
        version: detectVersion(url),
        traits: [],
        boundaries: {
            rateLimit: null,
            auth: 'Unknown',
            methods: [],
        }
    };

    // Trait Detection
    if (headers['content-type']?.includes('application/json')) profile.traits.push('JSON');
    if (headers['content-type']?.includes('application/xml')) profile.traits.push('XML');
    if (headers['x-powered-by']) profile.traits.push(`Powered by ${headers['x-powered-by']}`);
    if (headers['server']) profile.traits.push(`Server: ${headers['server']}`);

    // Boundary Detection: Rate Limiting
    const rateLimitHeader = headers['x-ratelimit-limit'] || headers['ratelimit-limit'];
    const rateLimitRemaining = headers['x-ratelimit-remaining'] || headers['ratelimit-remaining'];
    if (rateLimitHeader) {
        profile.boundaries.rateLimit = {
            limit: rateLimitHeader,
            remaining: rateLimitRemaining,
            reset: headers['x-ratelimit-reset'] || headers['ratelimit-reset']
        };
        profile.traits.push('Rate Limited');
    }

    // Boundary Detection: Auth
    if (status === 401 || status === 403) {
        profile.boundaries.auth = 'Required';
    } else if (headers['www-authenticate']) {
        profile.boundaries.auth = headers['www-authenticate'];
    }

    // Boundary Detection: CORS
    if (headers['access-control-allow-origin']) {
        profile.traits.push('CORS Enabled');
    }

    // GraphQL Detection
    if (url.includes('graphql') || (response.data && response.data.data && !response.data.errors)) {
        profile.traits.push('GraphQL');
    }

    return profile;
};

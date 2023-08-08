function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}

function validateEnv() {
    const intervalMilis = process.env.INTERVAL ? parseInt(process.env.INTERVAL) : null;
    const bikeUrls = JSON.parse(process.env.BIKE_URLS.replace(/'/g, '"'));

    if (intervalMilis === null || intervalMilis < 1) {
        throw new Error('Invalid interval. Please set process.env.INTERVAL to a value greater than or equal to 1.');
    }

    if (!Array.isArray(bikeUrls) || bikeUrls.length === 0 || !bikeUrls.every(url => isValidURL(url))) {
        throw new Error('Invalid bikeURLs. Please provide a valid array of URLs with at least one URL.');
    }

    if (!process.env.TELEGRAM_TOKEN) {
        throw new Error('TELEGRAM_TOKEN is missing. Please provide a valid token in your .env file.');
    }

    if (!process.env.TELEGRAM_CHAT_ID) {
        throw new Error('TELEGRAM_CHAT_ID is missing. Please provide a valid token in your .env file.');
    }

    if (!process.env.BIKE_SIZE) {
        throw new Error('BIKE_SIZE is missing. Please provide a valid token in your .env file.');
    }
}

module.exports = {
    isValidURL,
    validateEnv,
};

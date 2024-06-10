import { isValidURL, validateEnv } from '../validations';

describe('isValidURL', () => {
    it('returns true for valid URLs', () => {
        expect(isValidURL('https://silviosantos.io')).toBe(true);
    });

    it('returns false for invalid URLs', () => {
        expect(isValidURL('not a url')).toBe(false);
    });
});

describe('validateEnv', () => {
    let originalEnv: NodeJS.ProcessEnv;

    beforeEach(() => {
        // Store the original process.env
        originalEnv = process.env;
    });

    afterEach(() => {
        // Restore the original process.env after each test
        process.env = originalEnv;
    });

    it('throws an error if INTERVAL is invalid', () => {
        process.env = { INTERVAL: '0' };
        expect(() => validateEnv()).toThrow('Invalid interval. Please set process.env.INTERVAL to a value greater than or equal to 1.');
    });

    it('throws an error if BIKE_URLS is invalid', () => {
        process.env = { INTERVAL: '1', BIKE_URLS: '["invalid_url"]' };
        expect(() => validateEnv()).toThrow('Invalid bikeURLs. Please provide a valid array of URLs with at least one URL.');
    });

    it('throws an error if TELEGRAM_TOKEN is missing', () => {
        process.env = { INTERVAL: '1', BIKE_URLS: '["https://valid_url.com"]' };
        expect(() => validateEnv()).toThrow('TELEGRAM_TOKEN is missing. Please provide a valid token in your .env file.');
    });

    it('throws an error if TELEGRAM_CHAT_ID is missing', () => {
        process.env = { INTERVAL: '1', BIKE_URLS: '["https://valid_url.com"]', TELEGRAM_TOKEN: 'valid_token' };
        expect(() => validateEnv()).toThrow('TELEGRAM_CHAT_ID is missing. Please provide a valid token in your .env file.');
    });

    it('throws an error if BIKE_SIZE is missing', () => {
        process.env = { INTERVAL: '1', BIKE_URLS: '["https://valid_url.com"]', TELEGRAM_TOKEN: 'valid_token', TELEGRAM_CHAT_ID: 'valid_chat_id' };
        expect(() => validateEnv()).toThrow('BIKE_SIZE is missing. Please provide a valid token in your .env file.');
    });

    it('does not throw an error if all environment variables are valid', () => {
        process.env = { INTERVAL: '1', BIKE_URLS: '["https://valid_url.com"]', TELEGRAM_TOKEN: 'valid_token', TELEGRAM_CHAT_ID: 'valid_chat_id', BIKE_SIZE: 'valid_size' };
        expect(() => validateEnv()).not.toThrow();
    });

});
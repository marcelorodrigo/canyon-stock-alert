import { isValidURL } from './validations';

describe('isValidURL', () => {
    it('returns true for valid URLs', () => {
        expect(isValidURL('https://silviosantos.io')).toBe(true);
    });

    it('returns false for invalid URLs', () => {
        expect(isValidURL('not a url')).toBe(false);
    });
});
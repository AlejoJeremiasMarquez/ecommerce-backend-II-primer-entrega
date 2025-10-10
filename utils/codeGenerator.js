import crypto from 'crypto';

export const generateUniqueCode = () => {
    return crypto.randomBytes(8).toString('hex').toUpperCase();
};

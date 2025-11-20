
/**
 * Utilities specifically for the Rwandan context
 */

/**
 * Validates and formats a Rwandan phone number.
 * Accepts formats: 078..., 25078..., +25078...
 * Returns format: 25078... (Standard format for MTN/Airtel APIs)
 * Throws error if invalid.
 */
export const formatRwandaPhone = (phone: string): string => {
    // Remove non-numeric characters
    const cleaned = phone.replace(/\D/g, '');

    // Check lengths
    // Case 1: 0788123456 (10 digits) -> Add 250
    if (cleaned.length === 10 && (cleaned.startsWith('078') || cleaned.startsWith('079') || cleaned.startsWith('073') || cleaned.startsWith('072'))) {
        return '250' + cleaned.substring(1);
    }

    // Case 2: 250788123456 (12 digits) -> Return as is
    if (cleaned.length === 12 && cleaned.startsWith('2507')) {
        return cleaned;
    }

    throw new Error(`Invalid Rwandan phone number: ${phone}. Must start with 07... or 2507...`);
};

/**
 * Validates National ID (NID) format (16 digits)
 */
export const validateNID = (nid: string): boolean => {
    const cleaned = nid.replace(/\D/g, '');
    return cleaned.length === 16;
};

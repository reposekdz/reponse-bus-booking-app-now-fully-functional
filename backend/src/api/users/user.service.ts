import { pool } from '../../config/db';
import { AppError } from '../../utils/AppError';
import * as mysql from 'mysql2/promise';

export const updateUserAvatar = async (userId: number, avatarDataUri: string) => {
    if (!avatarDataUri || !avatarDataUri.startsWith('data:image')) {
        throw new AppError('Invalid image data provided.', 400);
    }

    const [result] = await pool.query<mysql.OkPacket>(
        'UPDATE users SET avatar_url = ? WHERE id = ?',
        [avatarDataUri, userId]
    );

    if (result.affectedRows === 0) {
        throw new AppError('User not found.', 404);
    }
    
    // Return the new URL to update the frontend state
    return { avatarUrl: avatarDataUri };
};

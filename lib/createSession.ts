import { NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { getRedis } from './getRedis';
import { setCookie } from './setCookie';

export const createSession = async (res: NextApiResponse, userId: string): Promise<void> => {
	const redis = await getRedis();
	const sessionToken = uuidv4();

	// Set the session token to expire in a week if not refreshed (see getUserId)
	await redis.set(sessionToken, userId, { EX: 86_400 * 7 });
	setCookie(res, 'session', sessionToken);
};

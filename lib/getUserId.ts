import { NextApiRequest } from 'next';
import { getRedis } from './getRedis';

export const getUserId = async (req: NextApiRequest): Promise<string | null> => {
	const sessionToken = req.cookies.session;
	if (!sessionToken) return null;

	const redis = await getRedis();

	const userId = await redis.get(sessionToken);
	if (!userId) return null;

	// Refresh the session token to expire in 7 days from the last usage
	await redis.set(sessionToken, userId, { EX: 86_400 * 7 });

	return userId;
};

import { createClient, RedisClientType } from 'redis';

const redis = createClient({ url: process.env.REDIS_URI! });
let connected = false;

export const getRedis = async (): Promise<RedisClientType<any>> => {
	if (!connected) {
		await redis.connect();
		connected = true;
	}

	return redis;
};

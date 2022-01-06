import { scrypt } from 'crypto';
import { promisify } from 'util';

export const hashPassword = async (password: string): Promise<string> => {
	const hashBuffer: Buffer = (await promisify(scrypt)(
		password,
		process.env.SCRYPT_SALT!,
		64,
	)) as any;
	return hashBuffer.toString('hex');
};

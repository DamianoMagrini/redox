import type { NextApiHandler } from 'next';
import { getUserId } from '../../../lib/getUserId';
import { ErrorResponse } from '../../../models/responses/ErrorResponse';

const meHandler: NextApiHandler<MeResponse | ErrorResponse> = async (req, res) => {
	if (req.method !== 'GET') return res.status(405).json({ error: 'This endpoint only supports GET' });

	const userId = await getUserId(req);
	return res.status(200).json({ userId });
};

export default meHandler;

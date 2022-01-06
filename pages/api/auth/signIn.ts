import type { NextApiHandler } from 'next';
import { createSession } from '../../../lib/createSession';
import { getDatabase } from '../../../lib/getDatabase';
import { hashPassword } from '../../../lib/hashPassword';
import { UserDocument } from '../../../models/documents/UserDocument';
import { signInRequestSchema } from '../../../models/requests/SignInRequest';
import { ErrorResponse } from '../../../models/responses/ErrorResponse';
import { OkResponse } from '../../../models/responses/OkResponse';

const signInHandler: NextApiHandler<OkResponse | ErrorResponse> = async (req, res) => {
	if (req.method !== 'POST') return res.status(405).json({ error: 'This endpoint only supports POST' });

	const requestBodyValidationResult = signInRequestSchema.validate(req.body);
	if (requestBodyValidationResult.error) {
		return res.status(200).json({ ok: false, error: requestBodyValidationResult.error });
	}

	const usersCollection = (await getDatabase()).collection<UserDocument>('users');

	const user = await usersCollection.findOne({ email: { $eq: requestBodyValidationResult.value.email } });
	if (!user) return res.status(404).json({ error: 'No user found with this email address' });

	const hashedPassword = await hashPassword(requestBodyValidationResult.value.password);
	if (hashedPassword !== user.passwordHash) {
		return res.status(403).json({ error: 'Wrong password' });
	} else {
		await createSession(res, user._id.toString());
		return res.status(200).json({ ok: true });
	}
};

export default signInHandler;

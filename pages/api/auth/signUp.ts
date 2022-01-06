import type { NextApiHandler } from 'next';
import { createSession } from '../../../lib/createSession';
import { getDatabase } from '../../../lib/getDatabase';
import { hashPassword } from '../../../lib/hashPassword';
import { UserDocument } from '../../../models/documents/UserDocument';
import { signUpRequestSchema } from '../../../models/requests/SignUpRequest';
import { ErrorResponse } from '../../../models/responses/ErrorResponse';
import { OkResponse } from '../../../models/responses/OkResponse';

const signUpHandler: NextApiHandler<OkResponse | ErrorResponse> = async (req, res) => {
	if (req.method !== 'POST') return res.status(405).json({ error: 'This endpoint only supports POST' });

	const requestBodyValidationResult = signUpRequestSchema.validate(req.body);
	if (requestBodyValidationResult.error) {
		return res.status(200).json({ ok: false, error: requestBodyValidationResult.error });
	}

	const usersCollection = (await getDatabase()).collection<UserDocument>('users');

	const existingUser = await usersCollection.findOne({ email: { $eq: requestBodyValidationResult.value.email } });
	if (existingUser) return res.status(409).json({ error: 'A user with this email address already exists' });

	try {
		const insertUserResult = await usersCollection.insertOne({
			fullName: requestBodyValidationResult.value.fullName,
			email: requestBodyValidationResult.value.email,
			passwordHash: await hashPassword(requestBodyValidationResult.value.password),
		});

		await createSession(res, insertUserResult.insertedId.toString());

		return res.status(200).json({ ok: true });
	} catch (error) {
		console.error('Error while trying to create a user!', error);
		return res.status(500).json({ error: JSON.stringify(error) });
	}
};

export default signUpHandler;

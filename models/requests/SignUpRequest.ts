import Joi from 'joi';
import { IS_SERVER } from '../../lib/constants';

export interface SignUpRequest {
	fullName: string;
	email: string;
	password: string;
}

export const signUpRequestSchema = Joi.object<SignUpRequest>({
	fullName: Joi.string().min(3).required(),
	email: Joi.string()
		// Only validate TLDs on the server
		.email({ tlds: IS_SERVER ? { allow: true } : false })
		.required(),
	password: Joi.string().min(8).required(),
});

import Joi from 'joi';
import { IS_SERVER } from '../../lib/constants';

export interface SignInRequest {
	email: string;
	password: string;
}

export const signInRequestSchema = Joi.object<SignInRequest>({
	email: Joi.string()
		// Only validate TLDs on the server
		.email({ tlds: IS_SERVER ? { allow: true } : false })
		.required(),
	password: Joi.string().required(),
});

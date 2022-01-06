import { ValidationError } from 'joi';

export interface SuccessfulOkResponse {
	ok: true;
}

export interface OkResponseWithFormError {
	ok: false;
	error: ValidationError;
}

export type OkResponse = SuccessfulOkResponse | OkResponseWithFormError;

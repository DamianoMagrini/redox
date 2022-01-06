import { RedoxDocumentDocument } from '../documents/RedoxDocumentDocument';
import { OkResponse } from './OkResponse';

export interface GetDocumentResponse {
	document: RedoxDocumentDocument;
}

export type DocumentReponse = GetDocumentResponse | OkResponse;

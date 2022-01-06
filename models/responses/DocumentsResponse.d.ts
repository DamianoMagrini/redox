import { RedoxDocumentHead } from '../app/RedoxDocument';

export interface GetDocumentsResponse {
	documentHeads: (RedoxDocumentHead & { _id: string })[];
}

export interface PostDocumentResponse {
	documentId: string;
}

export type DocumentsResponse = GetDocumentsResponse | PostDocumentResponse;

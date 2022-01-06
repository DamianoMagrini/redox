import { ObjectId } from 'mongodb';
import type { NextApiHandler } from 'next';
import { getDatabase } from '../../../lib/getDatabase';
import { getUserId } from '../../../lib/getUserId';
import { RedoxDocumentDocument } from '../../../models/documents/RedoxDocumentDocument';
import { putDocumentRequestSchema } from '../../../models/requests/PutDocumentRequest';
import { DocumentReponse } from '../../../models/responses/DocumentResponse';
import { ErrorResponse } from '../../../models/responses/ErrorResponse';

const documentHandler: NextApiHandler<DocumentReponse | ErrorResponse> = async (req, res) => {
	if (req.method !== 'GET' && req.method !== 'PUT' && req.method !== 'DELETE') {
		return res.status(405).json({ error: 'This endpoint only supports GET, PUT, and DELETE' });
	}

	const documentId = req.query.documentId as string;
	if (documentId.length !== 24) return res.status(400).json({ error: 'Document id must be 24 characters long' });

	const userId = await getUserId(req);
	if (!userId) return res.status(401).send({ error: 'You must be signed in to get, update, or delete documents' });

	const documentsCollection = (await getDatabase()).collection<RedoxDocumentDocument>('documents');

	switch (req.method) {
		case 'GET': {
			const document = await documentsCollection.findOne({ _id: new ObjectId(documentId), ownerId: userId });
			if (!document) return res.status(404).json({ error: 'No document found with this id' });
			return res.status(200).json({ document });
		}
		case 'PUT': {
			// const existingDocument = await documentsCollection.findOne({ _id: new ObjectId(documentId), ownerId: userId });
			// if (!existingDocument) return res.status(404).json({ error: 'You may not update inexistent documents' });

			const requestBodyValidationResult = putDocumentRequestSchema.validate(req.body);
			if (requestBodyValidationResult.error) return res.status(400).json({ error: 'Malformed request' });

			await documentsCollection.updateOne(
				{ _id: { $eq: new ObjectId(documentId) }, ownerId: userId },
				{ $set: requestBodyValidationResult.value },
			);

			return res.status(200).json({ ok: true });
		}
		case 'DELETE': {
			const deleteResult = await documentsCollection.deleteOne({
				_id: { $eq: new ObjectId(documentId) },
				ownerId: userId,
			});
			if (deleteResult.deletedCount === 1) return res.status(200).json({ ok: true });
			else return res.status(404).json({ error: 'No document found with this id' });
		}
	}
};

export default documentHandler;

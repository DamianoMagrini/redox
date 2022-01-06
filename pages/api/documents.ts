import { NextApiHandler } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../../lib/getDatabase';
import { getUserId } from '../../lib/getUserId';
import { RedoxDocumentDocument } from '../../models/documents/RedoxDocumentDocument';
import { DocumentsResponse } from '../../models/responses/DocumentsResponse';
import { ErrorResponse } from '../../models/responses/ErrorResponse';

const documentsHandler: NextApiHandler<DocumentsResponse | ErrorResponse> = async (req, res) => {
	if (req.method !== 'GET' && req.method !== 'POST') {
		return res.status(405).json({ error: 'This endpoint only supports GET and POST' });
	}

	const userId = await getUserId(req);
	if (!userId) return res.status(401).send({ error: 'You must be signed in to get or create documents' });

	const documentsCollection = (await getDatabase()).collection<RedoxDocumentDocument>('documents');

	switch (req.method) {
		case 'GET': {
			const documentHeads = await documentsCollection
				.find({ ownerId: { $eq: userId } }, { projection: { blocks: 0 } })
				.toArray();
			// @ts-expect-error ObjectId automatically gets converted to string when res body is stringified
			return res.status(200).send({ documentHeads });
		}
		case 'POST': {
			const insertDocumentResult = await documentsCollection.insertOne({
				name: 'Untitled document',
				ownerId: userId,
				createdAt: Date.now(),
				editedAt: Date.now(),
				blocks: [{ id: uuidv4(), type: 'paragraph', textNodes: [] }],
			});
			return res.status(201).send({ documentId: insertDocumentResult.insertedId.toString() });
		}
	}
};

export default documentsHandler;

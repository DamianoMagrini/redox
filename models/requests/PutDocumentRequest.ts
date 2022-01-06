import Joi from 'joi';
import { RedoxDocumentBlockNode, RedoxDocumentTextNode, RedoxDocumentTextNodeStyle } from '../app/RedoxDocument';
import { RedoxDocumentDocument } from '../documents/RedoxDocumentDocument';

export type PutDocumentRequest = Omit<RedoxDocumentDocument, 'ownerId' | 'createdAt'>;

export const putDocumentRequestSchema = Joi.object<PutDocumentRequest>({
	name: Joi.string().required(),
	editedAt: Joi.number().required(),
	blocks: Joi.array().items(
		Joi.object<RedoxDocumentBlockNode>({
			id: Joi.string()
				.regex(/[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}/)
				.required(),
			type: Joi.allow('h1', 'h2', 'h3', 'paragraph', 'orderedListItem', 'unorderedListItem', 'quote').required(),
			textNodes: Joi.array().items(
				Joi.object<RedoxDocumentTextNode>({
					content: Joi.string().min(1).required(),
					href: Joi.string().allow(null).required(),
					style: Joi.object<RedoxDocumentTextNodeStyle>({
						bold: Joi.boolean(),
						italic: Joi.boolean(),
						strikethrough: Joi.boolean(),
						underline: Joi.boolean(),
						code: Joi.boolean(),
					}),
				}),
			),
		}),
	),
});

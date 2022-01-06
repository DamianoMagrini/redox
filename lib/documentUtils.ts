import { RedoxDocument, RedoxDocumentBlockNode } from '../models/app/RedoxDocument';

export const removeBlock = (document: RedoxDocument, blockId: string): RedoxDocument => {
	const updatedBlocks = document.blocks.filter((block) => block.id !== blockId);

	return {
		name: document.name,
		createdAt: document.createdAt,
		editedAt: Date.now(),
		blocks: updatedBlocks,
	};
};

export const insertBlockAfter = (
	document: RedoxDocument,
	after: string,
	block: RedoxDocumentBlockNode,
): RedoxDocument => {
	const updatedBlocks = [...document.blocks];

	updatedBlocks.splice(updatedBlocks.findIndex((_) => _.id === after) + 1, 0, block);

	return {
		name: document.name,
		createdAt: document.createdAt,
		editedAt: Date.now(),
		blocks: updatedBlocks,
	};
};

export const replaceBlock = (document: RedoxDocument, block: RedoxDocumentBlockNode): RedoxDocument => {
	const updatedBlocks = [...document.blocks];

	updatedBlocks.splice(
		updatedBlocks.findIndex((_) => _.id === block.id),
		1,
		block,
	);

	return {
		name: document.name,
		createdAt: document.createdAt,
		editedAt: Date.now(),
		blocks: updatedBlocks,
	};
};

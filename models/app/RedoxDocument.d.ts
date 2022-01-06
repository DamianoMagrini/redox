export interface RedoxDocumentHead {
	name: string;
	createdAt: number;
	editedAt: number;
}

export interface RedoxDocument extends RedoxDocumentHead {
	blocks: RedoxDocumentBlockNode[];
}

export type RedoxDocumentBlockNodeType =
	| 'h1'
	| 'h2'
	| 'h3'
	| 'paragraph'
	| 'orderedListItem'
	| 'unorderedListItem'
	| 'quote';

export interface RedoxDocumentBlockNode {
	id: string;
	type: RedoxDocumentBlockNodeType;
	textNodes: RedoxDocumentTextNode[];
}

export interface RedoxDocumentTextNode {
	content: string;
	href: string | null;
	style: RedoxDocumentTextNodeStyle;
}

export interface RedoxDocumentTextNodeStyle {
	bold: boolean;
	italic: boolean;
	strikethrough: boolean;
	underline: boolean;
	code: boolean;
}

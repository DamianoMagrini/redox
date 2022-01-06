import clsx from 'clsx';
import { RedoxDocumentTextNode } from '../models/app/RedoxDocument';

export const renderBlockNode = (textNodes: RedoxDocumentTextNode[]): HTMLElement[] => {
	let elements: HTMLElement[] = [];

	for (const textNodeIndex in textNodes) {
		const textNode = textNodes[textNodeIndex];

		if (!textNode.content) continue;

		const element = document.createElement('span');
		element.innerText = textNode.content;
		element.className = clsx({
			'font-bold': textNode.style.bold,
			italic: textNode.style.italic,
			'line-through': textNode.style.strikethrough,
			underline: textNode.style.underline,
			'font-mono': textNode.style.code,
		});

		if (textNode.href) {
			const linkElement = document.createElement('a');
			linkElement.appendChild(element);
			linkElement.href = textNode.href;
			elements.push(linkElement);
		} else {
			elements.push(element);
		}
	}

	return elements;
};

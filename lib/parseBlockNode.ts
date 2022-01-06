import { RedoxDocumentTextNode } from '../models/app/RedoxDocument';

const haveSameAttributes = (textNodeA: RedoxDocumentTextNode, textNodeB: RedoxDocumentTextNode) =>
	textNodeA.href === textNodeB.href &&
	textNodeA.style.bold === textNodeB.style.bold &&
	textNodeA.style.italic === textNodeB.style.italic &&
	textNodeA.style.strikethrough === textNodeB.style.strikethrough &&
	textNodeA.style.underline === textNodeB.style.underline &&
	textNodeA.style.code === textNodeB.style.code;

const mergeAdjacentTextNodes = (textNodes: RedoxDocumentTextNode[]) => {
	const mergedTextNodes: RedoxDocumentTextNode[] = [];

	for (const textNode of textNodes) {
		if (mergedTextNodes.length === 0) {
			mergedTextNodes.push(textNode);
			continue;
		}
		const lastTextNode = mergedTextNodes[mergedTextNodes.length - 1];
		if (haveSameAttributes(textNode, lastTextNode)) {
			lastTextNode.content += textNode.content;
		} else {
			mergedTextNodes.push(textNode);
		}
	}

	return mergedTextNodes;
};

const shouldPartialAttributeBeTrue = (
	currentPartialAttribute: boolean | null | undefined,
	hasPositiveClass: boolean,
	hasNegativeClass: boolean,
) => {
	return currentPartialAttribute === false
		? false
		: hasNegativeClass
		? false
		: currentPartialAttribute ?? (hasPositiveClass ? true : undefined);
};

interface TextNodePartialAttributes {
	href?: string | null;
	bold?: boolean | null;
	italic?: boolean | null;
	strikethrough?: boolean | null;
	underline?: boolean | null;
	code?: boolean | null;
}

export const parseBlockNodeRecursive = (
	root: Node,
	partialAttributes: TextNodePartialAttributes = {},
): RedoxDocumentTextNode[] => {
	const redoxTextNodes: RedoxDocumentTextNode[] = [];

	for (const childNode of root.childNodes) {
		if (childNode instanceof Text) {
			if (childNode.textContent) {
				redoxTextNodes.push({
					content: childNode.textContent,
					href: partialAttributes.href ?? null,
					style: {
						bold: partialAttributes?.bold ?? false,
						italic: partialAttributes?.italic ?? false,
						strikethrough: partialAttributes?.strikethrough ?? false,
						underline: partialAttributes?.underline ?? false,
						code: partialAttributes?.code ?? false,
					},
				});
			}
		} else if (childNode instanceof HTMLElement) {
			const href = (childNode as HTMLAnchorElement).href ?? partialAttributes.href;
			const bold = shouldPartialAttributeBeTrue(
				partialAttributes?.bold,
				childNode.classList.contains('font-bold'),
				childNode.classList.contains('x-font-bold'),
			);
			const italic = shouldPartialAttributeBeTrue(
				partialAttributes?.italic,
				childNode.classList.contains('italic'),
				childNode.classList.contains('x-italic'),
			);
			const strikethrough = shouldPartialAttributeBeTrue(
				partialAttributes?.strikethrough,
				childNode.classList.contains('line-through'),
				childNode.classList.contains('x-line-through'),
			);
			const underline = shouldPartialAttributeBeTrue(
				partialAttributes?.underline,
				childNode.classList.contains('underline'),
				childNode.classList.contains('x-underline'),
			);
			const code = shouldPartialAttributeBeTrue(
				partialAttributes?.code,
				childNode.classList.contains('font-mono'),
				childNode.classList.contains('x-font-mono'),
			);

			const newAttributes: TextNodePartialAttributes = {
				href,
				bold,
				italic,
				strikethrough,
				underline,
				code,
			};

			redoxTextNodes.push(...parseBlockNodeRecursive(childNode, newAttributes));
		}
	}

	return mergeAdjacentTextNodes(redoxTextNodes);
};

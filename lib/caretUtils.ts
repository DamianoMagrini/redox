export const getCaretCharacterOffsetWithin = (element: HTMLElement, end: boolean): number => {
	const selection = window.getSelection();
	if (!selection || selection.rangeCount === 0) return 0;
	const range = selection.getRangeAt(0);
	const preCaretRange = range.cloneRange();
	preCaretRange.selectNodeContents(element);
	if (end) {
		preCaretRange.setEnd(range.endContainer, range.endOffset);
	} else {
		preCaretRange.setEnd(range.startContainer, range.startOffset);
	}
	return preCaretRange.toString().length;
};

export const setCaretPosition = (element: Node, offset: number, end: boolean): number => {
	for (const childNode of element.childNodes) {
		if (childNode instanceof Text) {
			if (childNode.length >= offset) {
				const selection = window.getSelection()!;
				const range = selection.getRangeAt(0);
				if (end) {
					range.setEnd(childNode, offset);
				} else {
					range.setStart(childNode, offset);
				}
				return -1;
			} else {
				offset -= childNode.length;
			}
		} else {
			offset = setCaretPosition(childNode, offset, end);
			if (offset === -1) {
				return -1;
			}
		}
	}
	return offset;
};

export const getCaretCoordinates = (): { x: number; y: number } => {
	const selection = window.getSelection();
	if (!selection || selection.rangeCount === 0) return { x: 0, y: 0 };

	const range = selection.getRangeAt(0).cloneRange();

	const rect = range.getClientRects()[0];
	if (!rect) return { x: 0, y: 0 };

	return { x: (rect.left + rect.right) / 2, y: rect.top };
};

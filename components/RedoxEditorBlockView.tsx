import { Component, createRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getCaretCharacterOffsetWithin, getCaretCoordinates, setCaretPosition } from '../lib/caretUtils';
import { parseBlockNodeRecursive } from '../lib/parseBlockNode';
import { renderBlockNode } from '../lib/renderBlockNode';
import { RedoxDocumentBlockNode, RedoxDocumentBlockNodeType } from '../models/app/RedoxDocument';

const BLOCK_TYPE_TO_ELEMENT: Record<RedoxDocumentBlockNodeType, keyof JSX.IntrinsicElements> = {
	h1: 'h1',
	h2: 'h2',
	h3: 'h3',
	paragraph: 'p',
	orderedListItem: 'li',
	unorderedListItem: 'li',
	quote: 'blockquote',
};

const BLOCK_TYPE_TO_CLASSLIST: Record<RedoxDocumentBlockNodeType, string> = {
	h1: 'outline-none text-2xl font-semibold mt-8 focus:ring ring-indigo-200',
	h2: 'outline-none text-xl font-semibold mt-6 focus:ring ring-indigo-200',
	h3: 'outline-none text-lg font-semibold mt-4 focus:ring ring-indigo-200',
	paragraph: 'outline-none leading-relaxed mt-2 focus:ring ring-indigo-200',
	orderedListItem: 'outline-none leading-relaxed mt-2 pl-4 list-decimal focus:ring ring-indigo-200',
	unorderedListItem: 'outline-none leading-relaxed mt-2 pl-4 list-disc focus:ring ring-indigo-200',
	quote: 'outline-none leading-relaxed mt-2 px-4 border-slate-200 border-l-2 focus:ring ring-indigo-200',
};

const isClassAlreadyApplied = (rootNode: DocumentFragment, commonAncestorContainer: Node, className: string) => {
	let isApplied = rootNode.children.length > 0;
	for (const childElement of rootNode.children ?? []) {
		if (!childElement.innerHTML) continue;
		if (childElement.tagName === 'A') {
			if (!childElement.firstElementChild!.classList.contains(className)) isApplied = false;
		} else {
			if (!childElement.classList.contains(className)) isApplied = false;
		}
	}
	if (commonAncestorContainer.parentElement?.classList.contains(className)) {
		isApplied = true;
	}
	return isApplied;
};

export interface RedoxEditorBlockViewProps {
	blockIndex: number;
	blockNode: RedoxDocumentBlockNode;
	onUpdate: (block: RedoxDocumentBlockNode) => void;
	onDelete: (blockIndex: number, blockId: string, tryToFocusNext: boolean) => void;
	onCreateNew: (blockId: string, newBlock: RedoxDocumentBlockNode) => void;
	onFocusPrevious: (blockIndex: number) => void;
	onFocusNext: (blockIndex: number) => void;
}

interface RedoxEditorBlockViewState {
	isPopupShown: boolean;
	popupCoordinates: { x: number; y: number };
}

export class RedoxEditorBlockView extends Component<RedoxEditorBlockViewProps, RedoxEditorBlockViewState> {
	state = {
		isPopupShown: false,
		popupCoordinates: { x: 0, y: 0 },
	};

	ref = createRef<HTMLDivElement>();

	shouldComponentUpdate(nextProps: RedoxEditorBlockViewProps, nextState: RedoxEditorBlockViewState) {
		const { blockIndex, blockNode, onUpdate, onDelete, onCreateNew, onFocusPrevious, onFocusNext } = this.props;
		return (
			JSON.stringify(blockNode) !== JSON.stringify(nextProps.blockNode) ||
			JSON.stringify(this.state) !== JSON.stringify(nextState) ||
			blockIndex !== nextProps.blockIndex
			// These conditions should never be true
			// onUpdate !== nextProps.onUpdate ||
			// onDelete !== nextProps.onDelete ||
			// onCreateNew !== nextProps.onCreateNew ||
			// onFocusPrevious !== nextProps.onFocusPrevious ||
			// onFocusNext !== nextProps.onFocusNext
		);
	}

	focus = (end?: boolean) => {
		this.ref.current?.focus();
		if (end) {
			const range = window.getSelection()!.getRangeAt(0);
			range.selectNodeContents(this.ref.current!);
			range.collapse();
		}
	};

	componentDidMount() {
		const { blockNode } = this.props;
		this.focus(true);
		this.ref.current?.replaceChildren(...renderBlockNode(blockNode.textNodes));
		this.refreshInnerHTML();
	}

	refreshInnerHTML = () => {
		const { blockNode, onUpdate } = this.props;
		const [lastOffsetStart, lastOffsetEnd] = [
			getCaretCharacterOffsetWithin(this.ref.current!, false),
			getCaretCharacterOffsetWithin(this.ref.current!, true),
		];
		const parsedTextNodes = parseBlockNodeRecursive(this.ref.current!);
		this.ref.current?.replaceChildren(...renderBlockNode(parsedTextNodes));
		setCaretPosition(this.ref.current!, lastOffsetStart, false);
		setCaretPosition(this.ref.current!, lastOffsetEnd, true);
		onUpdate({ id: blockNode.id, type: blockNode.type, textNodes: parsedTextNodes });
	};

	getSnapshotBeforeUpdate() {
		return [
			getCaretCharacterOffsetWithin(this.ref.current!, false),
			getCaretCharacterOffsetWithin(this.ref.current!, true),
		];
	}

	componentDidUpdate(
		_previousProps: RedoxEditorBlockViewProps,
		_previousState: RedoxEditorBlockViewState,
		snapshot: [number, number],
	) {
		const [lastOffsetStart, lastOffsetEnd] = snapshot;
		const { blockNode } = this.props;
		this.ref.current?.replaceChildren(...renderBlockNode(blockNode.textNodes));
		setCaretPosition(this.ref.current!, lastOffsetStart, false);
		setCaretPosition(this.ref.current!, lastOffsetEnd, true);
	}

	flipClass = (className: string) => {
		const selection = window.getSelection()!;
		const range = selection.getRangeAt(0);
		const contents = range.cloneContents();

		const isApplied = isClassAlreadyApplied(contents, range.commonAncestorContainer, className);

		range.deleteContents();
		const element = document.createElement('span');
		element.classList.add(isApplied ? `x-${className}` : className);
		element.appendChild(contents);
		range.insertNode(element);

		this.refreshInnerHTML();
	};

	render() {
		const { blockIndex, blockNode, onCreateNew, onDelete, onUpdate, onFocusPrevious, onFocusNext } = this.props;
		const { isPopupShown, popupCoordinates } = this.state;

		// `as 'div'` is an ugly hack so that TypeScript doesn't go crazy with intersection types
		const Element = BLOCK_TYPE_TO_ELEMENT[blockNode.type] as 'div';

		return (
			<>
				<div
					onBlur={() => this.setState({ isPopupShown: false })}
					className={`${isPopupShown ? 'block' : 'hidden'} fixed bg-white -translate-x-1/2 -translate-y-10`}
					style={{ left: popupCoordinates.x, top: popupCoordinates.y }}>
					<select
						value={blockNode.type}
						onChange={(e) => {
							onUpdate({
								id: blockNode.id,
								type: e.target.value as RedoxDocumentBlockNodeType,
								textNodes: blockNode.textNodes,
							});
						}}>
						<option value='h1'>h1</option>
						<option value='h2'>h2</option>
						<option value='h3'>h3</option>
						<option value='paragraph'>paragraph</option>
						<option value='orderedListItem'>orderedListItem</option>
						<option value='unorderedListItem'>unorderedListItem</option>
						<option value='quote'>quote</option>
					</select>
				</div>
				<Element
					className={BLOCK_TYPE_TO_CLASSLIST[blockNode.type]}
					ref={this.ref}
					contentEditable
					onDragStart={(e) => e.preventDefault()}
					onSelect={() => {
						const range = window.getSelection()!.getRangeAt(0);
						if (range.collapsed) {
							this.setState({ isPopupShown: false });
						} else {
							this.setState({
								isPopupShown: true,
								popupCoordinates: getCaretCoordinates(),
							});
						}
					}}
					onKeyDown={(e) => {
						if (e.ctrlKey || e.metaKey) {
							switch (e.key) {
								case 'b':
									e.preventDefault();
									this.flipClass('font-bold');
									break;
								case 'i':
									e.preventDefault();
									this.flipClass('italic');
									break;
								case 'S':
									e.preventDefault();
									this.flipClass('line-through');
									break;
								case 'u':
									e.preventDefault();
									this.flipClass('underline');
									break;
								case 'C':
									e.preventDefault();
									this.flipClass('font-mono');
									break;
								default:
									break;
							}
						} else {
							switch (e.key) {
								case 'Backspace':
									if (this.ref.current?.innerText === '')
										setTimeout(() => onDelete(blockIndex, blockNode.id, false), 1);
									break;
								case 'Delete':
									if (this.ref.current?.innerText === '') setTimeout(() => onDelete(blockIndex, blockNode.id, true), 1);
									break;
								case 'Enter':
								case 'Return':
									const selection = window.getSelection()!;
									const range = selection.getRangeAt(0);
									range.setEndAfter(this.ref.current!);
									const contents = range.cloneContents();
									range.deleteContents();
									this.refreshInnerHTML();
									const parsedContents = parseBlockNodeRecursive(contents);
									onCreateNew(blockNode.id, { id: uuidv4(), type: 'paragraph', textNodes: parsedContents });
								case 'Right':
								case 'ArrowRight':
								case 'Down':
								case 'ArrowDown':
									if (getCaretCharacterOffsetWithin(this.ref.current!, false) >= this.ref.current!.innerText.length) {
										setTimeout(() => onFocusNext(blockIndex), 1);
									}
									break;
								case 'Left':
								case 'ArrowLeft':
								case 'Up':
								case 'ArrowUp':
									if (getCaretCharacterOffsetWithin(this.ref.current!, true) === 0) {
										setTimeout(() => onFocusPrevious(blockIndex), 1);
									}
									break;
								default:
									break;
							}
						}
					}}
					onInput={this.refreshInnerHTML}
				/>
			</>
		);
	}
}

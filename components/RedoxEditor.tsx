import React, { Component } from 'react';
import { insertBlockAfter, removeBlock, replaceBlock } from '../lib/documentUtils';
import { RedoxDocument, RedoxDocumentBlockNode } from '../models/app/RedoxDocument';
import { RedoxEditorBlockView } from './RedoxEditorBlockView';

export interface RedoxEditorProps {
	redoxDocument: RedoxDocument;
	updateDocument: (redoxDocument: RedoxDocument) => void;
}

export class RedoxEditor extends Component<RedoxEditorProps> {
	private blockRefs: (RedoxEditorBlockView | null)[] = [];

	updateBlock = (blockNode: RedoxDocumentBlockNode) => {
		const { redoxDocument, updateDocument } = this.props;
		updateDocument(replaceBlock(redoxDocument, blockNode));
	};
	deleteBlock = (blockIndex: number, blockId: string, tryToFocusNext: boolean) => {
		const { redoxDocument, updateDocument } = this.props;
		if (blockIndex === 0) return;
		if (tryToFocusNext) (this.blockRefs[blockIndex + 1] ?? this.blockRefs[blockIndex - 1])?.focus();
		else this.blockRefs[blockIndex - 1]?.focus(true);
		updateDocument(removeBlock(redoxDocument, blockId));
	};
	createBlock = (blockId: string, newBlock: RedoxDocumentBlockNode) => {
		const { redoxDocument, updateDocument } = this.props;
		updateDocument(insertBlockAfter(redoxDocument, blockId, newBlock));
	};
	focusPreviousBlock = (blockIndex: number) => {
		this.blockRefs[blockIndex - 1]?.focus(true);
	};
	focusNextBlock = (blockIndex: number) => {
		this.blockRefs[blockIndex + 1]?.focus();
	};

	render() {
		const { redoxDocument } = this.props;

		return (
			<div className='w-full max-w-xl mx-auto'>
				{redoxDocument.blocks.map((blockNode, index, blocks) => {
					return (
						<RedoxEditorBlockView
							ref={(ref) => (this.blockRefs[index] = ref)}
							key={blockNode.id}
							blockIndex={index}
							blockNode={blockNode}
							onUpdate={this.updateBlock}
							onDelete={this.deleteBlock}
							onCreateNew={this.createBlock}
							onFocusPrevious={this.focusPreviousBlock}
							onFocusNext={this.focusNextBlock}
						/>
					);
				})}
			</div>
		);
	}
}

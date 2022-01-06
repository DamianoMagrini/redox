import { RedoxDocument } from '../models/app/RedoxDocument';

export const mockDocument: RedoxDocument = {
	name: 'Mock document',
	createdAt: Date.now(),
	editedAt: Date.now(),
	blocks: [
		{
			id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
			type: 'h1',
			textNodes: [
				{
					content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit,',
					href: null,
					style: { bold: true, italic: false, strikethrough: true, underline: true, code: false },
				},
				{
					content: ' sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
					href: null,
					style: { bold: false, italic: true, strikethrough: false, underline: false, code: false },
				},
				{
					content: 'Ut enim ad minim veniam.',
					href: 'https://www.lipsum.com/',
					style: { bold: false, italic: false, strikethrough: false, underline: false, code: true },
				},
			],
		},
		{
			id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa5',
			type: 'h2',
			textNodes: [
				{
					content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit,',
					href: null,
					style: { bold: true, italic: false, strikethrough: true, underline: true, code: false },
				},
				{
					content: ' sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
					href: null,
					style: { bold: false, italic: true, strikethrough: false, underline: false, code: false },
				},
				{
					content: 'Ut enim ad minim veniam.',
					href: 'https://www.lipsum.com/',
					style: { bold: false, italic: false, strikethrough: false, underline: false, code: true },
				},
			],
		},
		{
			id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa9',
			type: 'h3',
			textNodes: [
				{
					content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit,',
					href: null,
					style: { bold: true, italic: false, strikethrough: true, underline: true, code: false },
				},
				{
					content: ' sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
					href: null,
					style: { bold: false, italic: true, strikethrough: false, underline: false, code: false },
				},
				{
					content: 'Ut enim ad minim veniam.',
					href: 'https://www.lipsum.com/',
					style: { bold: false, italic: false, strikethrough: false, underline: false, code: true },
				},
			],
		},
		{
			id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa13',
			type: 'paragraph',
			textNodes: [
				{
					content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit,',
					href: null,
					style: { bold: true, italic: false, strikethrough: true, underline: true, code: false },
				},
				{
					content: ' sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
					href: null,
					style: { bold: false, italic: true, strikethrough: false, underline: false, code: false },
				},
				{
					content: 'Ut enim ad minim veniam.',
					href: 'https://www.lipsum.com/',
					style: { bold: false, italic: false, strikethrough: false, underline: false, code: true },
				},
			],
		},
		{
			id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa17',
			type: 'orderedListItem',
			textNodes: [
				{
					content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit,',
					href: null,
					style: { bold: true, italic: false, strikethrough: true, underline: true, code: false },
				},
				{
					content: ' sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
					href: null,
					style: { bold: false, italic: true, strikethrough: false, underline: false, code: false },
				},
				{
					content: 'Ut enim ad minim veniam.',
					href: 'https://www.lipsum.com/',
					style: { bold: false, italic: false, strikethrough: false, underline: false, code: true },
				},
			],
		},
		{
			id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa21',
			type: 'unorderedListItem',
			textNodes: [
				{
					content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit,',
					href: null,
					style: { bold: true, italic: false, strikethrough: true, underline: true, code: false },
				},
				{
					content: ' sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
					href: null,
					style: { bold: false, italic: true, strikethrough: false, underline: false, code: false },
				},
				{
					content: 'Ut enim ad minim veniam.',
					href: 'https://www.lipsum.com/',
					style: { bold: false, italic: false, strikethrough: false, underline: false, code: true },
				},
			],
		},
		{
			id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa25',
			type: 'quote',
			textNodes: [
				{
					content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit,',
					href: null,
					style: { bold: true, italic: false, strikethrough: true, underline: true, code: false },
				},
				{
					content: ' sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
					href: null,
					style: { bold: false, italic: true, strikethrough: false, underline: false, code: false },
				},
				{
					content: 'Ut enim ad minim veniam.',
					href: 'https://www.lipsum.com/',
					style: { bold: false, italic: false, strikethrough: false, underline: false, code: true },
				},
			],
		},
		{
			id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa29',
			type: 'orderedListItem',
			textNodes: [
				{
					content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit,',
					href: null,
					style: { bold: true, italic: false, strikethrough: true, underline: true, code: false },
				},
				{
					content: ' sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
					href: null,
					style: { bold: false, italic: true, strikethrough: false, underline: false, code: false },
				},
				{
					content: 'Ut enim ad minim veniam.',
					href: 'https://www.lipsum.com/',
					style: { bold: false, italic: false, strikethrough: false, underline: false, code: true },
				},
			],
		},
	],
};

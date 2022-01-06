import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button } from '../../components/Button';
import { IconButton } from '../../components/IconButton';
import { RedoxEditor } from '../../components/RedoxEditor';
import { api } from '../../lib/api';
import { useDebouncedValue } from '../../lib/useDebouncedValue';
import { RedoxDocument } from '../../models/app/RedoxDocument';
import { GetDocumentResponse } from '../../models/responses/DocumentResponse';
import { OkResponse } from '../../models/responses/OkResponse';

const DocumentPage: NextPage = () => {
	const router = useRouter();
	const { documentId } = router.query;
	const [isDocumentLoaded, setIsDocumentLoaded] = useState(false);
	const [redoxDocument, setRedoxDocument] = useState<RedoxDocument>({
		name: 'Loading...',
		createdAt: Date.now(),
		editedAt: Date.now(),
		blocks: [],
	});
	const debouncedRedoxDocument = useDebouncedValue(redoxDocument, 1000);

	useEffect(() => {
		if (documentId)
			api
				.get<GetDocumentResponse>(`documents/${documentId}`)
				.then((response) => {
					setRedoxDocument(response.data.document);
					setIsDocumentLoaded(true);
				})
				.catch((error) => console.error(error.response.data));
	}, [documentId]);

	useEffect(() => {
		if (isDocumentLoaded)
			api
				.put<OkResponse>(`documents/${documentId}`, {
					name: debouncedRedoxDocument.name,
					editedAt: debouncedRedoxDocument.editedAt,
					blocks: debouncedRedoxDocument.blocks,
				})
				.then((response) => console.log(response.data))
				.catch((error) => console.error(error.response.data));
	}, [debouncedRedoxDocument, isDocumentLoaded, documentId]);

	return (
		<div className='bg-slate-50 h-screen overflow-auto'>
			<div className='flex w-full max-w-xl mx-auto bg-white border border-gray-200 mt-2 rounded-lg p-2 justify-start items-center gap-2'>
				<Link href='/'>
					<a>
						<IconButton>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-6 w-6'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'>
								<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
							</svg>
						</IconButton>
					</a>
				</Link>
				<input
					className='block w-full rounded-md border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 placeholder:text-slate-400'
					type='text'
					placeholder='Untitled document'
					value={redoxDocument.name}
					onChange={(e) => setRedoxDocument((_) => ({ ..._, name: e.target.value }))}
				/>
				<Button
					onClick={() => {
						api
							.delete(`documents/${documentId}`)
							.then((response) => router.replace('/'))
							.catch((error) => console.error(error.response.data));
					}}>
					Delete
				</Button>
			</div>
			<main>
				<RedoxEditor redoxDocument={redoxDocument} updateDocument={setRedoxDocument} />
			</main>
		</div>
	);
};

export default DocumentPage;

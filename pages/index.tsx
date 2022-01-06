import { serialize } from 'cookie';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { withAuthGuard } from '../components/guards/AuthGuard';
import { api } from '../lib/api';
import { mockDocument } from '../mock/mockDocument';
import { GetDocumentsResponse, PostDocumentResponse } from '../models/responses/DocumentsResponse';

const HomePage: NextPage = () => {
	const router = useRouter();

	const [isLoading, setIsLoading] = useState(true);
	const [documentHeads, setDocumentHeads] = useState<GetDocumentsResponse['documentHeads']>([]);

	useEffect(() => {
		api
			.get<GetDocumentsResponse>('documents')
			.then((response) => {
				setDocumentHeads(response.data.documentHeads);
				setIsLoading(false);
			})
			.catch((error) => console.error(error.response.data));
	}, []);

	return (
		<>
			<Head>
				<title>Redox</title>
				<meta name='description' content='A Next.js document editor' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main className='mx-auto w-full max-w-xl'>
				<div className='flex w-full max-w-xl mx-auto bg-white border border-gray-200 my-2 rounded-lg p-2 justify-between items-center gap-2'>
					<h1 className='text-xl mx-2 font-bold'>Redox</h1>
					<div className='flex gap-2'>
						<Button
							variant='primary'
							onClick={() => {
								setIsLoading(true);
								api
									.post<PostDocumentResponse>('documents', mockDocument)
									.then((response) => {
										router.push(`/documents/${response.data.documentId}`);
									})
									.catch((error) => console.error(error.response.data));
							}}>
							Create new
						</Button>
						<Button
							onClick={() => {
								document.cookie = serialize('session', '', { path: '/' });
								router.reload();
							}}>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-6 w-6'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
								/>
							</svg>
							Sign out
						</Button>
					</div>
				</div>
				{isLoading && <p>Loading...</p>}
				{documentHeads.map((documentHead) => (
					<Link key={documentHead._id} href={`/documents/${documentHead._id}`}>
						<a>
							<section className='px-4 py-2 rounded-md hover:bg-indigo-50 transition-colors flex items-center justify-between group'>
								<div>
									<h4 className='font-bold'>{documentHead.name}</h4>
									<p className='text-sm font-semibold tracking-wide text-slate-500'>
										Created {new Date(documentHead.createdAt).toLocaleDateString('en')} | Edited{' '}
										{new Date(documentHead.editedAt).toLocaleDateString('en')}
									</p>
								</div>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z'
									/>
								</svg>
							</section>
						</a>
					</Link>
				))}
			</main>
		</>
	);
};

export default withAuthGuard(true, '/auth/signIn')(HomePage);

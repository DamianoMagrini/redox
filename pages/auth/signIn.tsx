import { joiResolver } from '@hookform/resolvers/joi';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '../../components/Button';
import { withAuthGuard } from '../../components/guards/AuthGuard';
import { api } from '../../lib/api';
import { SignInRequest, signInRequestSchema } from '../../models/requests/SignInRequest';
import { OkResponse } from '../../models/responses/OkResponse';

const SignInPage: NextPage = () => {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignInRequest>({ resolver: joiResolver(signInRequestSchema) });
	const onSubmit: SubmitHandler<SignInRequest> = (data) => {
		api
			.post<OkResponse>('auth/signIn', data)
			.then((response) => {
				router.reload();
			})
			.catch((error) => console.error(error.response.data));
	};

	return (
		<>
			<Head>
				<title>Sign in | Redox</title>
				<meta name='description' content='A Next.js document editor' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<div className='flex justify-center items-center h-screen bg-slate-50'>
				<main className='bg-white w-96 p-5 rounded-lg border-gray-200 border'>
					<h1 className='text-2xl font-semibold'>Sign in</h1>
					<form onSubmit={handleSubmit(onSubmit)}>
						<label className='block mt-2'>
							<p className='text-sm'>Email</p>
							<input
								placeholder='name@example.com'
								className='mt-1 block w-full rounded-md border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 placeholder:text-slate-400'
								type='email'
								{...register('email')}
							/>
							<p className='text-sm text-red-500'>{errors.email?.message}</p>
						</label>

						<label className='block mt-2'>
							<p className='text-sm'>Password</p>
							<input
								placeholder='••••••••'
								className='mt-1 block w-full rounded-md border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 placeholder:text-slate-400'
								type='password'
								{...register('password')}
							/>
							<p className='text-sm text-red-500'>{errors.password?.message}</p>
						</label>

						<Button variant='primary' type='submit' block>
							Sign in
						</Button>
					</form>
					<p className='text-sm text-center'>
						Don't have an account?{' '}
						<Link href='/auth/signUp'>
							<a className='text-indigo-500 underline hover:bg-indigo-50'>Sign up instead</a>
						</Link>
					</p>
				</main>
			</div>
		</>
	);
};

export default withAuthGuard(false, '/')(SignInPage);

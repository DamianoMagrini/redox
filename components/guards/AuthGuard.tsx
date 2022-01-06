import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export interface AuthGuardProps {
	requireAuthenticated: boolean;
	redirectTo: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ requireAuthenticated, redirectTo, children }) => {
	const router = useRouter();
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

	useEffect(() => {
		api
			.get<MeResponse>('auth/me')
			.then((response) => {
				if (response.data.userId === null) setIsAuthenticated(false);
				else setIsAuthenticated(true);
			})
			.catch((error) => console.error(error.response.data));
	}, []);

	if (isAuthenticated === null) {
		return (
			<main className='flex h-screen justify-center items-center bg-slate-50'>
				<p className='text-sm'>Loading...</p>
			</main>
		);
	} else if (isAuthenticated === requireAuthenticated) {
		return <>{children}</>;
	} else {
		router.replace(redirectTo);
		return null;
	}
};

export const withAuthGuard = (requireAuthenticated: boolean, redirectTo: string) => (Component: React.ComponentType) =>
	function AuthGuardHOC() {
		return (
			<AuthGuard requireAuthenticated={requireAuthenticated} redirectTo={redirectTo}>
				<Component />
			</AuthGuard>
		);
	};

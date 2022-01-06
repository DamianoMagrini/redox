import clsx from 'clsx';
import { ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary';

export interface ButtonProps {
	onClick?: () => void;
	variant?: ButtonVariant;
	block?: boolean;
	type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'secondary', block = false, type }) => {
	return (
		<button
			onClick={onClick}
			className={clsx(
				'px-5 h-12 justify-center items-center gap-2 rounded-md outline-none focus:ring ring-indigo-200 font-semibold leading-none',
				{
					'bg-indigo-500 text-white hover:bg-indigo-600': variant === 'primary',
					'text-indigo-500 hover:bg-indigo-50': variant === 'secondary',
					'inline-flex': !block,
					'flex my-3 w-full': block,
				},
			)}
			type={type}>
			{children}
		</button>
	);
};

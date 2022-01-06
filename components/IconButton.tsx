import clsx from 'clsx';

export type IconButtonVariant = 'primary' | 'secondary';

export interface IconButtonProps {
	onClick?: () => void;
	variant?: IconButtonVariant;
}

export const IconButton: React.FC<IconButtonProps> = ({ children, onClick, variant = 'secondary' }) => {
	return (
		<button
			onClick={onClick}
			className={clsx('p-3 rounded-md outline-none focus:ring ring-indigo-200 font-semibold leading-none', {
				'bg-indigo-500 text-white hover:bg-indigo-600': variant === 'primary',
				'text-indigo-500 hover:bg-indigo-50': variant === 'secondary',
			})}>
			{children}
		</button>
	);
};

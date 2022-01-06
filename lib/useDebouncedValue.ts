import { useEffect, useState } from 'react';

/**
 * Courtesy of [useHooks](https://usehooks.com/useDebounce/)
 */
export const useDebouncedValue = <Type>(value: Type, delay: number): Type => {
	const [debouncedValue, setDebouncedValue] = useState<Type>(value);
	useEffect(() => {
		const handler = setTimeout(() => setDebouncedValue(value), delay);
		return () => clearTimeout(handler);
	}, [value, delay]);
	return debouncedValue;
};

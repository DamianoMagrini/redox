module.exports = {
	content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
	theme: {
		fontFamily: {
			sans: ['Inter', 'sans-serif'],
		},
		extend: {},
	},
	plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};

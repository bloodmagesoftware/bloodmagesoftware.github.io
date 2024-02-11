/** @type {import("prettier").Config} */
export default {
	trailingComma: "all",
	semi: true,
	singleQuote: false,
	tabWidth: 4,
	useTabs: true,
	plugins: ["prettier-plugin-astro"],
	overrides: [
		{
			files: "*.astro",
			options: {
				parser: "astro",
			},
		},
	],
};

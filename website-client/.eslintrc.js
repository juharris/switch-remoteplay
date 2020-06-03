module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: [
		'@typescript-eslint',
	],
	env: {
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react/recommended',
	],
	rules: {
		'comma-dangle': ['off', 'ignore'],
		'comma-spacing': ["error", { "before": false, "after": true }],
		indent: ['error', 'tab'],
		'no-tabs': 0,
		'operator-linebreak': ['off'],
		quotes: ['off'],
		semi: ['error', 'never'],
		'space-before-function-paren': [2, {
			named: 'never',
			anonymous: 'never',
			asyncArrow: 'always'
		}],
	},
}

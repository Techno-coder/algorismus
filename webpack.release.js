const path = require('path');

module.exports = {
	entry: './src/index.ts',
	mode: "production",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'style-loader',
					},
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1,
						}
					},
					{
						loader: 'postcss-loader'
					}
				]
			},
			{
				test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg)$/,
				loader: 'url-loader'
			}
		]
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js']
	},
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, 'build')
	},
};

module.exports = {
	options: {
		tasks: {
			dev: [
				'copy:third-party',
				'wrap',
				'copy:js',
				'concat'
			],
			min: [
				'copy:third-party',
				'wrap',
				'copy:js',
				'uglify',
				'concat'
			],
			'final': [
				'copy:demo',
				'copy:images',
				'copy:manifest'
			]
		}
	}
};

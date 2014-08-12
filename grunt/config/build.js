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
			]
		}
	}
};

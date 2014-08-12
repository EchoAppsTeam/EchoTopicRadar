module.exports = {
	dashboard: {
		src: [
			'<%= dirs.build %>/dashboard.js',
			'<%= dirs.build %>/dashboard/list.js',
			'<%= dirs.build %>/dashboard/item.js',
			'<%= dirs.build %>/dashboard/**/*.js'
		]
	},
	app: {
		src: [
			'<%= dirs.build %>/app.js',
			'<%= dirs.build %>/controls/*.js',
			'<%= dirs.build %>/third-party/*.js'
		]
	}
};

const ErrorResponse = require('./error-response');

const response = {
	update: async (result) => {
		return await {
			'updated': result.n
		};
	},

	config: {
		get: async (result) => {
			return await {
				'io': result.io,
				'plc': result.plc,
				'port': result.port,
				'thingapp': result.thingapp,
				'production': result.production
			};
		},

		status: async (result) => {
			return await {
				'status': result.status
			};
		},

		barcode: async (result) => {
			return await {
				'barcode': result.barcode
			};
		}
	}
};

const model = async (req, result) => {
	switch (req.originalUrl) {
		case ('*'):
			return await result;

		case ('/api/config/get'):
			return await response.config.get(result);
		case ('/api/config/status'):
			return await response.config.status(result);
		case ('/api/config/barcode'):
			return await response.config.barcode(result);

		case ('/api/config/update'):
			return await response.update(result);

		default:
			return await {
				'success': {
					'details': 'Your request resolved successfully but this payload is not modeled!'
				}
			};
	};
};

exports.error = async (req, res, err) => {
	res.status(err.error.code).json(err.error);
};

exports.success = async (req, res, result) => {
	try {
		res.json(await model(req, result));
	} catch (error) {
		var err = new ErrorResponse();
		err.error.code = 401;
		err.error.message = error.message;
		err.error.errors[0].code = 503;
		err.error.errors[0].reason = error.message;
		err.error.errors[0].message = error.message;
		responder.error(req, res, err);
	};
};
const Q = require('q');
const SystemFile = require('../lib/file');
const ErrorResponse = require('../lib/error-response');

var module = function() {
	var dalConfig = {
		get: (args) => {
			var deferred = Q.defer();

			try {
				const file = new SystemFile(__base + 'config.json');

				if (Array.isArray(args.req.body.filter) && args.req.body.filter.length > 0) {
					args.result = {};
					Object.keys(file.value).filter(key => args.req.body.filter.includes(key)).map(key => {
						args.result[key] = file.value[key];
					});
				} else {
					args.result = file.value;
				};
				deferred.resolve(args);
			} catch (error) {
				var err = new ErrorResponse();
				err.error.errors[0].code = 503;
				err.error.errors[0].reason = error.message;
				err.error.errors[0].message = error.message;
				deferred.reject(err);
			};

			return deferred.promise;
		},

		update: (args) => {
			var deferred = Q.defer();

			try {
				const file = new SystemFile(__base + 'config.json');

				var update = JSON.parse(JSON.stringify(file.value));

				if (Array.isArray(args.req.body.io)) {
					update.io = args.req.body.io;
				};
				if (typeof(args.req.body.plc) != 'undefined' && args.req.body.plc != null) {
					if (typeof(args.req.body.plc.ip) != 'undefined' && args.req.body.plc.ip != null && args.req.body.plc.ip != '') {
						update.plc.ip = args.req.body.plc.ip;
					};
					if (typeof(args.req.body.plc.port) != 'undefined' && args.req.body.plc.port != null && args.req.body.plc.port != '') {
						update.plc.port = args.req.body.plc.port;
					};
				};
				if (typeof(args.req.body.port) != 'undefined' && args.req.body.port != null && args.req.body.port != '') {
					update.port = args.req.body.port;
				};
				if (typeof(args.req.body.thingapp) != 'undefined' && args.req.body.thingapp != null && args.req.body.thingapp != '') {
					update.thingapp = args.req.body.thingapp;
				};
				if (typeof(args.req.body.production) != 'undefined' && args.req.body.production != null && args.req.body.production != '') {
					update.production = args.req.body.production;
				};

				file.save(update);

				args.result = {
					'n': 1
				};

				deferred.resolve(args);
			} catch (error) {
				var err = new ErrorResponse();
				err.error.errors[0].code = 503;
				err.error.errors[0].reason = error.message;
				err.error.errors[0].message = error.message;
				deferred.reject(err);
			};

			return deferred.promise;
		}
	};

	return {
		'config': dalConfig
	};
};

exports.module = module;
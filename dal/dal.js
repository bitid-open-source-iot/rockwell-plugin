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

		status: (args) => {
			var deferred = Q.defer();

			try {
				args.result = {
					'status': __status
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
					update.io.map(o => {
						delete o.tag;
					});
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
				if (typeof(args.req.body.server) != 'undefined' && args.req.body.server != null) {
					if (typeof(args.req.body.server.host) != 'undefined' && args.req.body.server.host != null && args.req.body.server.host != '') {
						update.server.host = args.req.body.server.host;
					};
					if (typeof(args.req.body.server.port) != 'undefined' && args.req.body.server.port != null && args.req.body.server.port != '') {
						update.server.port = args.req.body.server.port;
					};
					if (typeof(args.req.body.server.username) != 'undefined' && args.req.body.server.username != null && args.req.body.server.username != '') {
						update.server.username = args.req.body.server.username;
					};
					if (typeof(args.req.body.server.password) != 'undefined' && args.req.body.server.password != null && args.req.body.server.password != '') {
						update.server.password = args.req.body.server.password;
					};
					if (typeof(args.req.body.server.subscribe) != 'undefined' && args.req.body.server.subscribe != null && args.req.body.server.subscribe != '') {
						update.server.subscribe = args.req.body.server.subscribe;
					};
				};
				if (typeof(args.req.body.production) != 'undefined' && args.req.body.production != null && args.req.body.production != '') {
					update.production = args.req.body.production;
				};
				if (typeof(args.req.body.authentication) != 'undefined' && args.req.body.authentication != null && args.req.body.authentication != '') {
					update.authentication = args.req.body.authentication;
				};

				file.save(update);

				args.result = {
					'n': 1
				};

				__settings = update;

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
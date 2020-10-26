const Q = require('q');
const dal = require('../dal/dal');
const macaddress = require('macaddress');
const ErrorResponse = require('../lib/error-response');

var module = function () {
    var bllConfig = {
        get: (req, res) => {
            var args = {
                'req': req,
                'res': res
            };

            var myModule = new dal.module();
            myModule.config.get(args)
                .then(args => {
                    __responder.success(req, res, args.result);
                }, err => {
                    __responder.error(req, res, err);
                });
        },

        status: (req, res) => {
            var args = {
                'req': req,
                'res': res
            };

            var myModule = new dal.module();
            myModule.config.status(args)
                .then(args => {
                    __responder.success(req, res, args.result);
                }, err => {
                    __responder.error(req, res, err);
                });
        },

        update: (req, res) => {
            var args = {
                'req': req,
                'res': res
            };

            var myModule = new dal.module();
            myModule.config.update(args)
                .then(args => {
                    __responder.success(req, res, args.result);
                }, err => {
                    __responder.error(req, res, err);
                });
        },

        barcode: async (req, res) => {
            var args = {
                'req': req,
                'res': res
            };

            try {
                const address = await macaddress.one();
                args.result = {
                    'barcode': address.split(':').join('')
                };
                __responder.success(req, res, args.result);
            } catch (error) {
                var err = new ErrorResponse();
                err.error.errors[0].code = 503;
                err.error.errors[0].reason = error.message;
                err.error.errors[0].message = error.message;
                __responder.error(req, res, err);
            };
        }
    };

    return {
        'config': bllConfig
    };
};

exports.module = module;
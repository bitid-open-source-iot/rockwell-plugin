var bll = require('../bll/bll');
var router = require('express').Router();

router.use(function timeLog(req, res, next) {
    next();
});

router.post('/get', (req, res) => {
    var myModule = new bll.module();
    myModule.config.get(req, res);
});

router.post('/update', (req, res) => {
    var myModule = new bll.module();
    myModule.config.update(req, res);
});

module.exports = router;
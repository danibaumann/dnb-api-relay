const router = require('express').Router();
const dnbController = require('../controller/dnb.js')

router.get('/search/typeahead', dnbController.typeahead)
router.get('/match/cleanseMatch', dnbController.match)
router.get('/data/duns/:duns', dnbController.cmpelk)

module.exports = router;
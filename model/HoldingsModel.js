const {model} = require('mongoose');

const {HoldingSchema} = require('../schemas/HoldingsSchema');
const HoldingsModel = new model('Holding', HoldingSchema);
module.exports = {HoldingsModel};
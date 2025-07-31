const {model} = require('mongoose');
const { PositionsSchema } = require('../schemas/PositionsSchema');

const PositionsModel = new model("Position", PositionsSchema);
module.exports = {PositionsModel};

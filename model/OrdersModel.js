const {model} = require('mongoose');
const { OrdersSchema } = require('../schemas/OrdersSchemas');

const OrdersModel = new model("Order", OrdersSchema);
module.exports = {OrdersModel};
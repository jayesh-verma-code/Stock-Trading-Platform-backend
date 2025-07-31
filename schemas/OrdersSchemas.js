const {Schema} = require('mongoose');


const OrdersSchema = new Schema({
    name: String,
    qty: Number,
    price: Number,
    mode: String,
    date: String
    
});
module.exports = {OrdersSchema};


const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Productschema = new Schema({
    name: {
        type: String,
        required:true
    },
    desc: {
        type: String,
        required:true
    },
    image: {
        type: String,
        required:true
    },
    SKU: {
        type: String,
        required:true,
        unique:true
    },
    category_id: {
        type: String,
    },
    price: {
        type:Number,
        default:0
    },
    quantity: {
        type: Number
    }
}, { timeseries: true })


module.exports = mongoose.model.Product || mongoose.model("Product", Productschema);
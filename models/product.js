const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let productSchema = new Schema(

    //name - string
    //color - string
    //phone storage - number
    //description - string
    //price - number
    //inStock - boolean

    {
        name: {type: String},
        color: {type: String},
        storage: {type: Number},
        description: {type: String},
        price: {type: Number},
        inStock: {type: Boolean}
    }
);

module.exports = mongoose.model("Product", productSchema);
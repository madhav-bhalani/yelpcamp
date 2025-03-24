const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const objectId = Schema.Types.ObjectId;

const reviewSchema = new Schema({
    body: {
        type: String
    },
    rating: {
        type: Number
    },
    camp: {
        type: objectId
    }

});

module.exports = mongoose.model('Review', reviewSchema);


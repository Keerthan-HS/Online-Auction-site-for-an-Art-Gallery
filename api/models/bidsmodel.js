const mongoose = require('mongoose');
const User = require('../models/usersmodel');

//creating schema
const bidSchema = mongoose.Schema({
    //id: { type: mongoose.Schema.Types.ObjectId },
    name: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        username: String,
    },
    amt: { type: Number, required: true },
    //userInfo: { type: String },
});

//exporting the schema
module.exports = mongoose.model('Bids', bidSchema);
const mongoose = require('mongoose');
const Bids = require('../models/bidsmodel');

const gallerySchema = mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    name: { type: String },
    description: { type: String },
    category: { type: String },
    minbid: { type: Number },
    bid: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bids',
    }, ],
    owner: { type: String },
    image: { type: String },
    // productImage: { type: String, required: true }
});

module.exports = mongoose.model('Gallery', gallerySchema);
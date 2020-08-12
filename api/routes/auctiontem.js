const express = require('express');
const router = express.Router();
const Bid = require('../models/bidsmodel');
const Gallery = require('../models/gallerymodel');
const User = require('../models/usersmodel');
const { ensureAuthenticated } = require('../config/auth');

router.get('/', ensureAuthenticated, (req, res) => {
    Gallery.find({
            category: 'Paintings',
        },
        (err, allcamp) => {
            if (err) console.log('Govinda');
            else
                res.render('auction', {
                    product: allcamp,
                });
        }
    );
});

router.get('/:id', ensureAuthenticated, (req, res) => {
    Gallery.findById(req.params.id)
        .populate('bid')
        .exec((err, allcamp) => {
            if (err) {
                console.log(err + 'Govinda');
            } else {
                console.log('Higest:', allcamp);
                res.render('showtem', {
                    data: allcamp,
                    bid: sortArray(allcamp.bid),
                });
            }
        });
});

router.post('/:id/bid', ensureAuthenticated, (req, res) => {
    var base = 100;
    console.log(req.body);
    Gallery.findById(req.params.id, (err, foundProduct) => {
        if (err) console.log(err);
        else {
            const newBid = {
                amt: req.body.amt,
            };
            base = foundProduct.minbid;
            //getting username
            // console.log(req.user.username)
            // bid.name.id=req.user._id;

            console.log(req.user.email);
            Bid.create(newBid, (err, newlyCreated) => {
                //getting username
                console.log(newlyCreated);

                newlyCreated.name.username = req.user.name;
                //saving username and bid
                newlyCreated.save();
                foundProduct.bid.push(newlyCreated);
                foundProduct.save();
            });

            res.send({ name: req.user.name });
        }
    });
});

module.exports = router;

function sortArray(arr) {
    if (arr.length === 0) return [];
    const arr1 = arr.sort((a, b) => {
        return a.amt - b.amt;
    });
    console.log(arr1[0]);
    return arr1[0].amt;
}
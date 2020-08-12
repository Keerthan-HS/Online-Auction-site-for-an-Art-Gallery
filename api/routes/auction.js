const express = require('express');
const router = express.Router();
const Bid = require('../models/bidsmodel');
const Gallery = require('../models/gallerymodel');
const User = require('../models/usersmodel');
const { ensureAuthenticated } = require('../config/auth');
const app = require('../../app');
// const server = require('http').Server(app);
// const io = require('socket.io')(server);

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
        //.sort({ date: 'desc' })
        .exec((err, allcamp) => {
            if (err) {
                console.log(err + 'Govinda');
            } else {
                //console.log(allcamp);
                // allcamp.bids.forEach(e=>{
                //     Bid.findById(e,(err,foundBid)=>{
                //         if(err){}
                //         else{
                //             tempArray.push(foundBid)
                //         }
                //     })
                // });
                // console.log('This is tempArray:'+tempArray)
                // console.log(Object.values(allcamp));
                res.render('show', {
                    data: allcamp,
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
            //getting username
            // console.log(req.user.username)
            // bid.name.id=req.user._id;

            console.log(req.user.email);
            Bid.create(newBid, (err, newlyCreated) => {
                //getting username

                newlyCreated.name.username = req.user.name;
                //saving username and bid
                newlyCreated.save();
                foundProduct.bid.push(newlyCreated);
                foundProduct.save();
            });

            //console.log(foundProduct);
            res.send({ name: req.user.name });
            //res.redirect('/auction/' + req.params.id);
        }
    });
});

module.exports = router;
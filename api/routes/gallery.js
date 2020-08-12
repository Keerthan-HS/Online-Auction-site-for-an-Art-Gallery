const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Gallery = require('../models/gallerymodel');
const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });
const path = require('path');
const { ensureAuthenticated } = require('../config/auth');

// const multer = require('multer');

// var storage = multer.diskStorage({
//     destination: './public/uploads/',
//     filename: (req, image, cb) => {
//         cb(
//             null,
//             image.fieldname + '-' + Date.now() + path.extname(image.originalname)
//         );
//     },
// });

// var upload = multer({
//     storage: storage,
// }).single('image');

//route to get all products in gallery
// router.get('/', (req, res) => {
//     Gallery.find()
//         .select('_id name description time minbid category') //these things will be displayed.
//         .exec()
//         .then((docs) => {
//             const response = {
//                 count: docs.length,
//                 products: docs.map((doc) => {
//                     return {
//                         _id: doc._id,
//                         name: doc.name,
//                         description: doc.description,
//                         category: doc.category,
//                         time: doc.time, //time refers to timer here
//                         minbid: doc.minbid,
//                         // productImage: doc.productImage,
//                         request: {
//                             desc: 'Update or delete your product',
//                             update: 'http://localhost:3000/gallery/update/' + doc._id,
//                             delete: 'http://localhost:3000/gallery/update/' + doc._id,
//                         },
//                     };
//                 }),
//             };

//             res.status(200).json(response);
//         })
//         .catch((err) => {
//             console.log(err);
//             res.status(500).json({ error: err });
//         });
// });

router.get('/', (req, res) => {
    Gallery.find({}, (err, allcamp) => {
        if (err) console.log('Govinda');
        else
            res.render('gallery', {
                product: allcamp,
                cat: ' Collections',
            });
    });
});

router.get('/category/:category', (req, res) => {
    var gal = req.params.category;
    if (gal === 'Paintings') {
        Gallery.find({
                category: 'Paintings',
            },
            (err, allcamp) => {
                if (err) console.log('Govinda');
                else
                    res.render('gallery', {
                        product: allcamp,
                        cat: 'Paintings',
                    });
            }
        );
    } else if (gal === 'Sculptures') {
        Gallery.find({
                category: 'Sculptures',
            },
            (err, allcamp) => {
                if (err) console.log('Govinda');
                else
                    res.render('gallery', {
                        product: allcamp,
                        cat: 'Sculptures',
                    });
            }
        );
    } else if (gal === 'Photographs') {
        Gallery.find({
                category: 'Photographs',
            },
            (err, allcamp) => {
                if (err) console.log('Govinda');
                else
                    res.render('gallery', {
                        product: allcamp,
                        cat: 'Photopgraphs',
                    });
            }
        );
    } else if (gal === 'Sketches') {
        Gallery.find({
                category: 'Sketches',
            },
            (err, allcamp) => {
                if (err) console.log('Govinda');
                else
                    res.render('gallery', {
                        product: allcamp,
                        cat: 'Sketches',
                    });
            }
        );
    } else {
        Gallery.find({}, (err, allcamp) => {
            if (err) console.log('Govinda');
            else
                res.render('gallery', {
                    product: allcamp,
                    cat: 'Collection',
                });
        });
    }
});

// //route to reach a particular category
// router.get('/category/:category', (req, res) => {
//     const cats = req.params.category;
//     Gallery.find({ category: cats }, (err, product) => {
//         res.render('prodByCat', { product: product });
//     });
// });

//route to insert product to gallery
router.get('/addProduct', ensureAuthenticated, (req, res) => {
    res.render('productCreation');
});

//route to add products
router.post('/addProduct', ensureAuthenticated, (req, res, next) => {
    // console.log(req.body);
    // const file = req.file;
    // if (!file) {
    //     const error = new Error('Plz upload image');
    //     return next(error);
    // } else {
    //     res.send(file);
    // }
    const temp = {
        // _id: req.body._id,
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        minbid: req.body.minbid,
        owner: req.body.owner,
        image: req.body.image,
    };

    console.log('product added');
    Gallery.create(temp, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render('productList', { result: result });
        }
    });
});

//route to update product
// router.get('/:productId', (req, res) => {
//     console.log('hii');
//     res.render('edit-product');
// });

//route to find a particular product
router.get('/:productId', (req, res) => {
    let ID = req.params.productId;
    Gallery.findById({ _id: ID }, (err, result) => {
        if (err) {
            console.log(err);
            res.json({ err: err });
        } else {
            // return res.send('The resultant product is:');
            res.render('viewProduct', { reqProduct: result });
        }
    });
});

//route to update a product
router.get('/update/:productId', ensureAuthenticated, (req, res) => {
    console.log('entered');
    const ID = req.params.productId;
    Gallery.findById({ _id: ID }, (err, product) => {
        if (err) {
            console.log(err);
        } else {
            res.render('edit-Product', { element: product });
        }
    });
});

//route to get updated product
router.post('/update/:productId', ensureAuthenticated, (req, res) => {
    let ID = req.params.productId;
    Gallery.updateOne({ _id: ID }, {
            $set: {
                name: req.body.name,
                description: req.body.description,

                minbid: req.body.minbid,
            },
        })
        .exec()
        .then((add) => {
            res.redirect('/gallery/' + ID);
        })
        .catch((notAdd) => {
            res.send('Error while updating');
        });
    console.log('Updated ');
});

// router.put('/update/:productId', (res, req) => {
//     Gallery.findByIdAndUpdate(
//         req.params.productId, {
//             $set: {
//                 description: req.body.description,
//                 time: req.body.time,
//                 minbid: req.body.minbid,
//             },
//         },
//         (err, product) => {
//             if (err) {
//                 console.log(err);
//             } else {
//                 redirect('/gallery/' + req.params.productId);
//             }
//         }
//     );
// });

router.get('/delete/:productId', ensureAuthenticated, (req, res) => {
    let ID = req.params.productId;
    Gallery.deleteOne({ _id: ID }, (err, deleted) => {
        if (err) {
            res.send(err);
        } else {
            console.log('deleted ', deleted);
            res.redirect('/gallery');
        }
    });
    //res.send('Product successfully delete');
    //res.send('Delete Route');
});

router.get('/');

module.exports = router;
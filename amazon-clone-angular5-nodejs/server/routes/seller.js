const router = require('express').Router();
const Product = require('../models/product');

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = new aws.S3({
    accessKeyId: "AKIAIFLQGHPDGARBL3PQ",
    secretAccessKey: "2h59RoIS2t53vINE1WBw3WSWEdvnt4fuWDFKFzGZ"
});

const checkJWT = require('../middlewares/check-jwt');
const faker = require('faker');

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'mra-test-app',
        metadata: function (req, file, cb) {
            cb(null, {
                fieldName: file.fieldname
            });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString())
        }
    })
});

router.route('/products')
    .get(checkJWT, (req, res, next) => {
        Product.find({
                owner: req.decoded.user._id
            })
            .populate('owner')
            .populate('category')
            .exec((err, products) => {
                if (products) {
                    res.json({
                        success: true,
                        message: 'Products',
                        products: products
                    });
                }
            });
    })
    .post([checkJWT, upload.single('product_picture')], (req, res, next) => {
        console.log(upload);
        console.log(req.body.description);
        let product = new Product();
        product.owner = req.decoded.user._id;
        product.category = req.body.categoryId;
        product.title = req.body.title;
        product.price = req.body.price;
        product.description = req.body.description;
        product.image = req.file.location;
        product.save();
        res.json({
            success: true,
            message: 'Successfully added the product'
        });
    });

router.get('/faker/test', (req, res, next) => {
    for (let i = 0; i < 20; i++) {
        let product = new Product();
        product.category = "5acb771318eccf0396f855d9";
        product.owner = "5ac72b8344528d2d91fb6f59";
        product.image = faker.image.cats();
        product.title = faker.commerce.productName();
        product.description = faker.lorem.words();
        product.price = faker.commerce.price();
        product.save();
    }
    res.json({
        message: "Successfully added 20 products"
    });
});

module.exports = router;
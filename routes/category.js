const express = require("express");
const db = require("../models");
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary');
// uploader for images, make a uploads folder, pass through the route as middleware
const uploads = multer({ dest: './uploads'});

router.get("/", (req, res) => {
    db.category.findAll()
    .then(function(categories) {
        res.render("category/index", { categories: categories })
    })
})

router.get("/new", (req, res) => {
    db.category.findAll()
    .then(function(categories) {
        res.render("category/new", { categories: categories })
    })
})

router.post("/", uploads.single('inputFile'), async(req, res) => {
    try {
        const image = await req.file.path;
        console.log(image);
        const name = await req.body.name;
        console.log(name)
        cloudinary.uploader.upload(image, (result) => {
            // console.log(result);
            db.category.create({
                name: name,
                img: result.url
            })
            res.redirect('/category');
        });
    }catch(e) {
        console.log(e.message);
    }
});

module.exports = router;
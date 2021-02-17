const express = require("express");
const db = require("../models");
const router = express.Router();


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


module.exports = router;
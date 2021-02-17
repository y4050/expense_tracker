const express = require("express");
const db = require("../models");
const router = express.Router();


router.get("/", (req, res) => {
    res.send("Expense Page")
})

router.get("/new", (req, res) => {
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    console.log(today)

    db.category.findAll()
    .then(function(categories) {
        res.render("expense/new", { categories: categories, today })
    })
})


module.exports = router;
const express = require("express");
const db = require("../models");
const router = express.Router();


router.get("/", (req, res) => {
    db.expense.findAll()
    .then(function(expenses) {
        res.render("expense/home", { expenses: expenses })
    })
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

router.post("/", async(req, res) => {
    try{
        console.log(req.body)
        const date = await req.body.date;
        const name = await req.body.name;
        const categoryId = await req.body.categoryId;
        const amount = await req.body.amount;
        db.expense.create({
            name: name,
            date: date,
            categoryId: categoryId,
            amount: amount
        });
        res.redirect("/expense")
    }catch(e) {
        console.log(e.message)
    }
})

module.exports = router;
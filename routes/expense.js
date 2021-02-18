const express = require("express");
const db = require("../models");
const router = express.Router();

const Sequelize = require('sequelize');
const Op = Sequelize.Op;


router.get("/", async(req, res) => {
    try{
        // past 10 entries
        const expenses = await db.expense.findAll({ limit: 10 });
        const expenseDay = await db.expense.aggregate('date', 'DISTINCT', { plain: false })

        console.log(expenseDay)
        res.render("expense/home", { expenses, expenseDay })
    }catch(e) {
        console.log("******ERROR******")
        console.log(e.message)
    }
})

// New Expense Form Route
router.post("/new", (req, res) => {
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;

    db.category.findAll()
    .then(function(categories) {
        res.render("expense/new", { categories: categories, today })
    })
})

// Day View Route
router.post("/day", async(req, res) => {
    try {
        const chosenDate = await req.body.expenseDate;
        const theSum = 0;
        let expenses = await db.expense.findAll({
            where: {
                date: chosenDate
            }
        });
            res.render("expense/day", { expenses, chosenDate, theSum })
    }catch(e) {
        console.log("******ERROR*****", e.message)
    }
})

// Month View Route
router.post("/month", async(req, res) => {
    try {
        const chosenDate = await req.body.expenseDate;
        const theSum = 0;
        const chosenMonth = chosenDate.split("/")[0]
        const testing = chosenMonth + '%';
        let expenses = await db.expense.findAll({
            where: {
                date: {
                    [Op.like]: '2%'
                }
            }
        });
        console.log("*****", expenses)
            res.render("expense/month", { expenses, chosenDate, theSum, chosenMonth })
    }catch(e) {
        console.log("******ERROR*****", e.message)
    }
})





// New Expense Entry
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
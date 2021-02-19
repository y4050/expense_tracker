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
        // to find month like '1%'
        const theMonth = chosenMonth + '%';
        let expenses = await db.expense.findAll({
            where: {
                date: {
                    [Op.like]: theMonth
                }
            }
        });
        // make month display more user friendly
        let monthName = '';
        if (chosenMonth == '1') {
            monthName = 'January'
        } else if (chosenMonth == '2') {
            monthName = 'February'
        } else if (chosenMonth == '3') {
            monthName = 'March'
        } else if (chosenMonth == '4') {
            monthName = 'April'
        } else if (chosenMonth == '5') {
            monthName = 'May'
        } else if (chosenMonth == '6') {
            monthName = 'June'
        } else if (chosenMonth == '7') {
            monthName = 'July'
        } else if (chosenMonth == '8') {
            monthName = 'August'
        } else if (chosenMonth == '9') {
            monthName = 'September'
        } else if (chosenMonth == '10') {
            monthName = 'October'
        } else if (chosenMonth == '11') {
            monthName = 'November'
        } else if (chosenMonth == '12') {
            monthName = 'December'
        } else {
            monthName = "Something's wrong"
        }

        res.render("expense/month", { expenses, chosenDate, theSum, chosenMonth, monthName })
    }catch(e) {
        console.log("******ERROR*****", e.message)
    }
})

// Year View Route
router.post("/year", async(req, res) => {
    try {
        const expenseDay = await db.expense.aggregate('date', 'DISTINCT', { plain: false })
        const chosenDate = await req.body.expenseDate;
        const theSum = 0;
        const chosenYear = chosenDate.split("/")[2]
        // to search year like '%2021'
        const theYear = '%' + chosenYear;
        let expenses = await db.expense.findAll({
            where: {
                date: {
                    [Op.like]: theYear
                }
            }
        });
        // monthly
        const jan = await db.expense.sum('amount', { where: { date: { [Op.like]: "1%" } } });
        const feb = await db.expense.sum('amount', { where: { date: { [Op.like]: "2%" } } });
        const mar = await db.expense.sum('amount', { where: { date: { [Op.like]: "3%" } } });
        const apr = await db.expense.sum('amount', { where: { date: { [Op.like]: "4%" } } });
        const may = await db.expense.sum('amount', { where: { date: { [Op.like]: "5%" } } });
        const jun = await db.expense.sum('amount', { where: { date: { [Op.like]: "6%" } } });
        const jul = await db.expense.sum('amount', { where: { date: { [Op.like]: "7%" } } });
        const aug = await db.expense.sum('amount', { where: { date: { [Op.like]: "8%" } } });
        const sep = await db.expense.sum('amount', { where: { date: { [Op.like]: "9%" } } });
        const oct = await db.expense.sum('amount', { where: { date: { [Op.like]: "10%" } } });
        const nov = await db.expense.sum('amount', { where: { date: { [Op.like]: "11%" } } });
        const dec = await db.expense.sum('amount', { where: { date: { [Op.like]: "12%" } } });


        res.render("expense/year", { expenses, expenseDay, chosenDate, theSum, chosenYear, jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec })
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
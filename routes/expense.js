const express = require("express");
const db = require("../models");
const router = express.Router();

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const monthName = (theMonth) => {
    let temp ='';
    if (theMonth == '01') {
        temp = 'January'
    } else if (theMonth == '02') {
        temp = 'February'
    } else if (theMonth == '03') {
        temp = 'March'
    } else if (theMonth == '04') {
        temp = 'April'
    } else if (theMonth == '05') {
        temp = 'May'
    } else if (theMonth == '06') {
        temp = 'June'
    } else if (theMonth == '07') {
        temp = 'July'
    } else if (theMonth == '08') {
        temp = 'August'
    } else if (theMonth == '09') {
        temp = 'September'
    } else if (theMonth == '10') {
        temp = 'October'
    } else if (theMonth == '11') {
        temp = 'November'
    } else if (theMonth == '12') {
        temp = 'December'
    } else {
        temp = "Something's wrong"
    }
    return temp;
}



router.get("/", async(req, res) => {
    try{
        // past 10 entries
        const expenses = await db.expense.findAll({ limit: 10 });
        const expenseDay = await db.expense.aggregate('date', 'DISTINCT', { plain: false })
        const months = ['01','02','03','04','05','06','07','08','09','10','11','12']

        res.render("expense/home", { expenses, expenseDay, months })
    }catch(e) {
        console.log("******ERROR******")
        console.log(e.message)
    }
})

// New Expense Form Route
router.get("/new", (req, res) => {
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
            where: { date: chosenDate },
            include: [db.category]
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
        // to find month like '01%'
        const theMonth = chosenMonth + '%';
        let expenses = await db.expense.findAll({
            where: {
                date: {
                    [Op.like]: theMonth
                }
            },
            include: [db.category]
        });
        // make month display more user friendly
        let monthName = '';
        if (chosenMonth == '01') {
            monthName = 'January'
        } else if (chosenMonth == '02') {
            monthName = 'February'
        } else if (chosenMonth == '03') {
            monthName = 'March'
        } else if (chosenMonth == '04') {
            monthName = 'April'
        } else if (chosenMonth == '05') {
            monthName = 'May'
        } else if (chosenMonth == '06') {
            monthName = 'June'
        } else if (chosenMonth == '07') {
            monthName = 'July'
        } else if (chosenMonth == '08') {
            monthName = 'August'
        } else if (chosenMonth == '09') {
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
        const chosenDate = await req.body.expenseYear;
        const theSum = 0;
        const chosenYear = chosenDate.split("/")[2]
        // to search year like '%2021'
        const theYear = '%' + chosenDate;
        console.log(theYear)
        let expenses = await db.expense.findAll({
            where: {
                date: {
                    [Op.like]: theYear
                }
            }
        });
        // monthly
        const jan = await db.expense.sum('amount', { where: { date: { [Op.like]: "01%"+theYear } } });
        const feb = await db.expense.sum('amount', { where: { date: { [Op.like]: "02%"+theYear } } });
        const mar = await db.expense.sum('amount', { where: { date: { [Op.like]: "03%"+theYear } } });
        const apr = await db.expense.sum('amount', { where: { date: { [Op.like]: "04%"+theYear } } });
        const may = await db.expense.sum('amount', { where: { date: { [Op.like]: "05%"+theYear } } });
        const jun = await db.expense.sum('amount', { where: { date: { [Op.like]: "06%"+theYear } } });
        const jul = await db.expense.sum('amount', { where: { date: { [Op.like]: "07%"+theYear } } });
        const aug = await db.expense.sum('amount', { where: { date: { [Op.like]: "08%"+theYear } } });
        const sep = await db.expense.sum('amount', { where: { date: { [Op.like]: "09%"+theYear } } });
        const oct = await db.expense.sum('amount', { where: { date: { [Op.like]: "10%"+theYear } } });
        const nov = await db.expense.sum('amount', { where: { date: { [Op.like]: "11%"+theYear } } });
        const dec = await db.expense.sum('amount', { where: { date: { [Op.like]: "12%"+theYear } } });


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
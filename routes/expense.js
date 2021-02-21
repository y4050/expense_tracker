const express = require("express");
const db = require("../models");
const router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
// const methodOverride = require('method-override');
// const bodyParser = require('body-parser');

// // ------------------------------------ MIDDLEWARE
// const app = express();
// app.set('view engine', 'ejs');
// app.use(methodOverride('_method'));
// app.use(bodyParser.urlencoded({extended: false}));

// Session 
const SECRET_SESSION = process.env.SECRET_SESSION;
const isLoggedIn = require('../middleware/isLoggedIn');
const e = require("express");



router.get("/", async(req, res) => {
    try{
        // past 10 entries
        const currentUser = req.user.id
        const expenses = await db.expense.findAll({ limit: 10, where: {userId: currentUser}});
        const expenseDay = await db.expense.aggregate('date', 'DISTINCT', { plain: false, where: {userId: currentUser} } )
        let today = new Date();
        const yyyy = today.getFullYear();
        // specific selection option
        const allExpense = await db.expense.findAll({ where: { userId: currentUser}});
        const years = []
        const months = []
        const days = []
        const allExpenses = [...allExpense];
        console.log(allExpenses)

        // year
        if (allExpenses.date === null){
        } else {
            for (i of allExpenses){
                let temp = ''
                temp = String(i.date)
                years.push(temp.substring(0,4))
            }
            // const a = [...allExpenses]
            // a.forEach(function(expense) {
            //     years.push(expense.date.substring(0,4))
            // })
        }
        let uYear = [...new Set(years)];
        // month
        if (allExpenses.date === null){
        } else {
            for (i of allExpenses){
                let temp = ''
                temp = String(i.date)
                months.push(temp.substring(5,7))
            }
        }
        let uMonth = [...new Set(months)];
        // day
        if (allExpenses.date === null){
        } else {
            for (i of allExpenses){
                let temp = ''
                temp = String(i.date)
                days.push(temp.substring(8,10))
            }
        }
        let uDay = [...new Set(days)];


        res.render("expense/home", { expenses, expenseDay, yyyy, allExpense, uYear, uMonth, uDay })
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
    today = yyyy + '-' + mm + '-' + dd;
    console.log(today)
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
        const user = req.user.id
        let expenses = await db.expense.findAll({
            where: { date: chosenDate, userId: user },
            include: [db.category],
            order: [[ 'date', 'ASC' ]]
        });
        
        res.render("expense/day", { expenses, chosenDate, theSum })
    }catch(e) {
        console.log("******ERROR*****", e.message)
    }
})

// Specific View Day
router.post("/spec", async(req, res) => {
    try {
        const chosenYear = await req.body.theYear;
        const chosenMonth = await req.body.theMonth;
        const chosenDay = await req.body.theDay;
        const chosenDate = chosenYear + '-' + chosenMonth + '-' + chosenDay
        const theSum = 0;
        const user = req.user.id
        let expenses = await db.expense.findAll({
            where: { date: chosenDate, userId: user },
            include: [db.category],
            order: [[ 'date', 'ASC' ]]
        });
        
        res.render("expense/day", { expenses, chosenDate, theSum })
    }catch(e) {
        console.log("******ERROR*****", e.message)
    }
})

// Month View Route
router.post("/month", async(req, res) => {
    try {
        // from 01 - 12, options provided
        const chosenDate = await req.body.expenseDate;
        const theSum = 0;
        // to find month like '01%'
        let today = new Date();
        const yyyy = today.getFullYear();
        const theMonth = `${yyyy}-` + chosenDate + '-%';
        const currentUser = req.user.id
        let expenses = await db.expense.findAll({
            where: {
                date: {
                    [Op.iLike]: theMonth,

                },
                userId: req.user.id
            },
            include: [db.category]
        });
        // make month display more user friendly
        let monthName = '';
        if (chosenDate == '01') {
            monthName = 'January'
        } else if (chosenDate == '02') {
            monthName = 'February'
        } else if (chosenDate == '03') {
            monthName = 'March'
        } else if (chosenDate == '04') {
            monthName = 'April'
        } else if (chosenDate == '05') {
            monthName = 'May'
        } else if (chosenDate == '06') {
            monthName = 'June'
        } else if (chosenDate == '07') {
            monthName = 'July'
        } else if (chosenDate == '08') {
            monthName = 'August'
        } else if (chosenDate == '09') {
            monthName = 'September'
        } else if (chosenDate == '10') {
            monthName = 'October'
        } else if (chosenDate == '11') {
            monthName = 'November'
        } else if (chosenDate == '12') {
            monthName = 'December'
        } else {
            monthName = "Something's wrong"
        }

        res.render("expense/month", { expenses, chosenDate, theSum, monthName })
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
        const chosenYear = chosenDate.split("-")[0]
        // to search year like '%2021'
        const theYear = chosenDate + '%';
        console.log(theYear)
        let expenses = await db.expense.findAll({
            where: {
                date: {
                    [Op.like]: theYear
                },
                userId: req.user.id
            }
        });
        // monthly
        const jan = await db.expense.sum('amount', { where: { date: { [Op.like]: theYear+"01-%" }, userId: req.user.id } });
        const mar = await db.expense.sum('amount', { where: { date: { [Op.like]: theYear+"03-%" }, userId: req.user.id } });
        const feb = await db.expense.sum('amount', { where: { date: { [Op.like]: theYear+"02-%" }, userId: req.user.id } });
        const apr = await db.expense.sum('amount', { where: { date: { [Op.like]: theYear+"04-%" }, userId: req.user.id } });
        const may = await db.expense.sum('amount', { where: { date: { [Op.like]: theYear+"05-%" }, userId: req.user.id } });
        const jun = await db.expense.sum('amount', { where: { date: { [Op.like]: theYear+"06-%" }, userId: req.user.id } });
        const jul = await db.expense.sum('amount', { where: { date: { [Op.like]: theYear+"07-%" }, userId: req.user.id } });
        const aug = await db.expense.sum('amount', { where: { date: { [Op.like]: theYear+"08-%" }, userId: req.user.id } });
        const sep = await db.expense.sum('amount', { where: { date: { [Op.like]: theYear+"09-%" }, userId: req.user.id } });
        const oct = await db.expense.sum('amount', { where: { date: { [Op.like]: theYear+"10-%" }, userId: req.user.id } });
        const nov = await db.expense.sum('amount', { where: { date: { [Op.like]: theYear+"11-%" }, userId: req.user.id } });
        const dec = await db.expense.sum('amount', { where: { date: { [Op.like]: theYear+"12-%" }, userId: req.user.id } });

        console.log(feb)
        res.render("expense/year", { expenses, expenseDay, chosenDate, theSum, chosenYear, jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec })
    }catch(e) {
        console.log("******ERROR*****", e.message)
    }
})

// New Expense Entry
router.post("/", async(req, res) => {
    try{
        const users = ''
        // if(!req.user){
        //     req.guest.id + 1
        // }
        const id = await req.user.id
        const date = await req.body.date;
        const name = await req.body.name;
        const categoryId = await req.body.categoryId;
        const amount = await req.body.amount;
        db.expense.create({
            userId: id,
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

// Params, for redirect after update
router.get("/:id", async(req, res) => {
    try{
        const chosenDateO = await db.expense.findByPk(req.params.id)
        const chosenDate = chosenDateO.date
        let expenses = await db.expense.findAll({
            where: { date: chosenDate },
            include: [db.category]
        });
        let theSum = 0
        res.render("expense/day", { chosenDate, expenses, theSum });
    }catch(e) {
        console.log("****ERROR****", e.message)
    }
});


// GET Edit
router.get('/:id/edit', async(req, res) => {
    try{
        const expense = await db.expense.findOne({ where: {id: req.params.id}})
        const category = await db.category.findAll()
        console.log("HEREEEE",category)
        res.render('expense/edit', { expense, category });
    }catch(e) {
        console.log("***ERROR***", e.message)
    }

  });

// PUT Update
router.put('/:id', isLoggedIn, (req, res) => {
    db.expense.update({ name: req.body.name, amount: req.body.amount, categoryId: req.body.categoryId }, {
      where: {
        id: req.params.id
      }
    })
    .then((update)=> {
        console.log('Updated = ', update);
        res.redirect(`/expense/${req.params.id}`);
    });
  });
  
// Delete
router.delete('/:id', async(req, res) => {
    try{
        const deleted = await db.expense.destroy({
          where: {
            id: req.params.id
        }
    })
    res.redirect(`/expense/`);
        
    }catch(e) {
        console.log("***ERROR***", e.message)
    }
  });


module.exports = router;
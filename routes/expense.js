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
        // from 01 - 12, options provided
        const chosenDate = await req.body.expenseDate;
        const theSum = 0;
        // to find month like '01%'
        const theMonth = '20%' + chosenDate + '%';
        console.log(theMonth)
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
                }
            }
        });
        // monthly
        const jan = await db.expense.sum('amount', { where: { date: { [Op.like]: theYear+"01%" } } });
        const feb = await db.expense.sum('amount', { where: { date: { [Op.like]: theYear+"02%" } } });
        const mar = await db.expense.sum('amount', { where: { date: { [Op.like]: theYear+"03%" } } });
        const apr = await db.expense.sum('amount', { where: { date: { [Op.like]: theYear+"04%" } } });
        const may = await db.expense.sum('amount', { where: { date: { [Op.like]: theYear+"05%" } } });
        const jun = await db.expense.sum('amount', { where: { date: { [Op.like]: theYear+"06%" } } });
        const jul = await db.expense.sum('amount', { where: { date: { [Op.like]: theYear+"07%" } } });
        const aug = await db.expense.sum('amount', { where: { date: { [Op.like]: theYear+"08%" } } });
        const sep = await db.expense.sum('amount', { where: { date: { [Op.like]: theYear+"09%" } } });
        const oct = await db.expense.sum('amount', { where: { date: { [Op.like]: theYear+"10%" } } });
        const nov = await db.expense.sum('amount', { where: { date: { [Op.like]: theYear+"11%" } } });
        const dec = await db.expense.sum('amount', { where: { date: { [Op.like]: theYear+"12%" } } });

        console.log(feb)
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
router.get('/:id/edit', (req, res) => {
    db.expense.findOne({ where: {id: req.params.id}})
    .then((chosen)=> {
      res.render('expense/edit', {
        expense: chosen,
      });
    });
  });

// PUT Update
router.put('/:id', (req, res) => {
    db.expense.update({ name: req.body.name, amount: req.body.amount }, {
      where: {
        id: req.params.id
      }
    })
    .then((update)=> {
        console.log('Updated = ', update);
        res.redirect(`/expense/${req.params.id}`);
    });
  });

  // DELETE Dogs Destroy
// router.delete('/:id', (req, res) => {
//     db.expense.destroy({
//       where: {
//         id: req.params.id
//       }
//     })
//     .then((deleted) => {
//       console.log('Deleted = ', deleted);
//       res.redirect(`/expense/${req.params.id}`);
//     });
//   });
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
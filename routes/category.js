const express = require("express");
const db = require("../models");
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary');
// uploader for images, make a uploads folder, pass through the route as middleware
const uploads = multer({ dest: './uploads'});

router.get("/", async(req, res) => {
    try{
      const currentUser = req.user.id;
      const categories = await db.category.findAll({where: {userId: currentUser}})
      const findCat = await db.expense.aggregate('categoryId', 'DISTINCT', { plain: false, where: {userId: currentUser} } )
      const expenses = await db.expense.findAll({
        where: { userId: req.user.id },
        include: [db.category]
      })
      const theCat = 'All Categories'
      res.render("category/index", { categories, expenses, theCat, currentUser, findCat })
    }catch(e) {
      console.log("****ERROR****", e.message)
    }
});

{/* <h2>Expense By<%= ' '+theCat %>: </h2>
<% findCat.forEach(function(cat) { %>
    <div>
        <li style="list-style: none;">
            <% categories.forEach(function(category){ %>
                <% if(cat.DISTINCT == category.id) { %> 
                    <%= category.name %>
                    <img src="<%= category.img %>" alt="No Image" style="max-width: 1.5%;">
                    <a href="/category/<%=category.id%>/edit">Edit</a>
                    <% let sum = 0 %>
                    <% expenses.forEach(function(expense) { %>
                        <% if(category.id == expense.categoryId) { %>
                            <% sum+= parseFloat(expense.amount) %> 
                <% } %>
            <% }) %> 
            <p>Total: $<%= sum %></p>
        </li>
                <% } %> 
            <% }) %> 
    </div>
<% }) %>
<a href="/category/new">Create New Category</a><br />
<a href="/expense/">Back To Main</a> */}









router.get("/new", async(req, res) => {
  try{
    
    const categories = await db.category.findAll({where: {userId: req.user.id}})
    res.render("category/new", { categories: categories })

  }catch(e) {
    console.log("***ERROR***", e.message)
  }
});

router.post("/", uploads.single('inputFile'), async(req, res) => {
    try {
        const image = await req.file.path;
        const name = await req.body.name;
        const userId = await req.user.id;
        cloudinary.uploader.upload(image, (result) => {
            // console.log(result);
            db.category.create({
                name: name,
                userId: userId,
                img: result.url
            })
            res.redirect('/category/');
        });
    }catch(e) {
        console.log(e.message);
    }
});

// View by Category
router.post("/select", async(req, res) => {
  try {
      const chosenCat = await req.body.theCategory;
      const theSum = 0;
      const user = req.user.id
      let getCat = await db.category.findOne({ where: { id: chosenCat }});
      let catImg = getCat.img
      let theCat = getCat.name
      let expenses = await db.expense.findAll({
          where: { categoryId: chosenCat, userId: user },
          order: [[ 'date', 'ASC' ]]
      });
      
      res.render("category/selectShow", { expenses, theSum, theCat, catImg })
  }catch(e) {
      console.log("******ERROR*****", e.message)
  }
})


// GET Edit
router.get('/:id/edit', (req, res) => {
    db.category.findOne({ where: {id: req.params.id}})
    .then((chosen)=> {
      res.render('category/edit', {
        category: chosen,
      });
    });
  });

// PUT Update
router.put('/:id', (req, res) => {
    db.category.update({ name: req.body.name }, {
      where: {
        id: req.params.id
      }
    })
    .then((update)=> {
        console.log('Updated = ', update);
        res.redirect('/category/');
    });
  });


// DELETE
router.delete('/:id', async(req, res) => {
    try{
        const deleted = await db.category.destroy({
          where: {
            id: req.params.id
        }
    })
    res.redirect(`/category/`);
        
    }catch(e) {
        console.log("***ERROR***", e.message)
    }
  });




module.exports = router;
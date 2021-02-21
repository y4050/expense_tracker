const express = require("express");
const db = require("../models");
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary');
// uploader for images, make a uploads folder, pass through the route as middleware
const uploads = multer({ dest: './uploads'});

router.get("/", async(req, res) => {
    try{
      const categories = await db.category.findAll()
      const expenses = await db.expense.findAll({where: {userId: req.user.id}})
      const theCat = 'All Categories'
      res.render("category/index", { categories, expenses, theCat })
    }catch(e) {
      console.log("****ERROR****", e.message)
    }
});

router.get("/new", async(req, res) => {
  try{
    const category = await db.category.findAll()
    res.render("category/new", { categories: categories })

  }catch(e) {
    console.log("***ERROR***", e.message)
  }
});

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
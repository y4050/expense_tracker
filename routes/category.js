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
      const expenses = await db.expense.findAll()
      res.render("category/index", { categories, expenses })
    }catch(e) {
      console.log("****ERROR****", e.message)
    }
});

router.get("/new", (req, res) => {
    db.category.findAll()
    .then(function(categories) {
        res.render("category/new", { categories: categories })
    })
})

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
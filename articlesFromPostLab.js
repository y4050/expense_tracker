const express = require('express')
const db = require('../models')
const router = express.Router()

// POST /articles - create a new post
router.post('/', function(req, res) {
  db.article.create({
    title: req.body.title,
    content: req.body.content,
    authorId: req.body.authorId
  })
  .then(function(post) {
    res.redirect('/')
  })
  .catch(function(error) {
    res.status(400).render('main/404')
  })
})

// GET /articles/new - display form for creating new articles
router.get('/new', function(req, res) {
  db.author.findAll()
  .then(function(authors) {
    res.render('articles/new', { authors: authors })
  })
  .catch(function(error) {
    res.status(400).render('main/404')
  })
})

// GET /articles/:id - display a specific post and its author
router.get('/:id', function(req, res) {
  db.article.findOne({
    where: { id: req.params.id },
    include: [db.author, db.comment]
  })
  .then(function(article) {
    if (!article) throw Error()
    console.log('***********************')
    console.log(article.comments)
    console.log('***********************')
    console.log(article.author)
    res.render('articles/show', { article: article })
  })
  .catch(function(error) {
    console.log(error)
    res.status(400).render('main/404')
  })
})

// POST /articles/:id/comments - to create new associated comment
router.post('/:id/comments', (req, res)=> {
  db.article.findOne({
    where: { id: req.params.id },
  })
  .then((article) => {
    article.createComment({
      name: req.body.name,
      content: req.body.content
    }).then((comment) => {
    res.redirect(`/articles/${req.params.id}`)
    })
  })
  .catch((error)=> {
    console.log(error)
    res.status(400).render('main/404')
  })
})



module.exports = router

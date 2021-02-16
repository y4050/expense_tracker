// Make sure to require your models in the files where they will be used.
const db = require('../models');

db.user.create({
  name: 'Test1',
  email: 'testing@email.com',
  password: 'testtest',
  img: 'https://res.cloudinary.com/y4050/image/upload/v1613502798/expense_tracker/user-alt-512-1_vskwhs.png'
}).then(function(user) {
  console.log('Created: ', user.name)
})

db.expense.create({
  userId: '2',
  name: 'DD',
  categoryId: '1',
  date: '2/16/2021'
}).then(function(entry) {
  console.log('Created: ', entry.name)
})

db.category.create({
  name: 'drinks',
  img: 'https://res.cloudinary.com/y4050/image/upload/v1613505870/expense_tracker/drink_qlmbrw.png'
}).then(function(entry) {
  console.log('Created: ', entry.name)
})

db.guest.create({
  img: 'https://res.cloudinary.com/y4050/image/upload/v1613502798/expense_tracker/user-alt-512-1_vskwhs.png'
}).then(function(entry) {
  console.log('Created: ', entry.name)
})

db.user.findAll().then(function(user) {
  console.log('Found: ', user.name)
})
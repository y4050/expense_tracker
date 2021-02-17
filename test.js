// // Make sure to require your models in the files where they will be used.

const db = require("./models");

db.user.create({
  name: 'Test1',
  email: 'testing@email.com',
  password: 'testtest',
  profilePic: 'https://res.cloudinary.com/y4050/image/upload/v1613502798/expense_tracker/user-alt-512-1_vskwhs.png'
}).then(function(user) {
  console.log('Created: ', user.name)
})

db.expense.create({
  userId: '1',
  name: 'DD',
  categoryId: '1',
  date: '2/16/2021',
  amount: 2.3
});

db.expense.create({
  name: 'Burger',
  categoryId: '2',
  date: '2/17/2021',
  amount: 5,
  guestId: 1
});

db.category.create({
  name: 'drinks',
  img: 'https://res.cloudinary.com/y4050/image/upload/v1613505870/expense_tracker/drink_qlmbrw.png'
});

db.category.create({
  name: 'foods',
  img: 'https://res.cloudinary.com/y4050/image/upload/v1613540143/expense_tracker/food_swxzpl.png'
});

db.guest.create({
  name: 'Guest1'
})

// db.user.findAll().then(function(user) {
//   console.log('Found: ', user.name)
// })

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  user.init({
    name:DataTypes.STRING,
    username: {
      type: DataTypes.STRING,
      validate: {
       len: {
        args: [4,99],
        msg: 'Username must be between 4 and 99 characters'
       }
      }
    },
    password: DataTypes.STRING,
    name: {
      type: DataTypes.STRING,
      validate: {
       len: {
        args: [1,99],
        msg: 'Name must be between 1 and 99 characters'
       }
      }
    },
    img: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
  });
    // Before a user is created, we are encrypting the password and using hash in its place
    user.addHook('beforeCreate', (pendingUser) => { // pendingUser is object that gets passed to DB
      // Bcrypt is going to hash the password
      let hash = bcrypt.hashSync(pendingUser.password, 12); //
      pendingUser.password = hash; // this will go to the DB
    });
    // checking the password on Sign-In and comparing to the hashed password in the DB
    user.prototype.validPassword = function(typedPassword) {
      let isCorrectPassword = bcrypt.compareSync(typedPassword, this.password); // check to see if password is correct.
      
      return isCorrectPassword;
    }
    // return an object from the database of the user without the encrypted password
    user.prototype.toJSON = function() {
      let userData = this.get(); // 
      delete userData.password; // it doesn't delete password from database, only removes it. 
      
      return userData;
    }
  return user;
};
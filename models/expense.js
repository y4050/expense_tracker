'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class expense extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.expense.belongsTo(models.user);
      models.expense.belongsTo(models.guest);
      models.expense.belongsTo(models.category);
    }
  };
  expense.init({
    userId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    categoryId: DataTypes.INTEGER,
    date: DataTypes.STRING,
    amount: DataTypes.DECIMAL,
    guestId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'expense',
  });
  return expense;
};
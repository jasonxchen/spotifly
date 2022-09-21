'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class routine extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.routine.belongsTo(models.user);
      models.routine.belongsToMany(models.exercise, {through: "routines_exercises"});
      models.routine.hasMany(models.note);
    }
  }
  routine.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'routine',
  });
  return routine;
};
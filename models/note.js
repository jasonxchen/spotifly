'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class note extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.note.belongsTo(models.user);
      models.note.belongsTo(models.routine);
      models.note.belongsTo(models.exercise);
    }
  }
  note.init({
    text: DataTypes.TEXT,
    userId: DataTypes.INTEGER,
    routineId: DataTypes.INTEGER,
    exerciseId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'note',
  });
  return note;
};
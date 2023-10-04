const { Model, DataTypes } = require('sequelize');

const sequelize = require("../../../config/database")

class Surgeon extends Model {}

Surgeon.init({
  surgeon_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  surgeonname: {
    type: DataTypes.STRING,
  },

  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },

}, {
  sequelize,
  modelName: 'surgeon',
});

module.exports = Surgeon;


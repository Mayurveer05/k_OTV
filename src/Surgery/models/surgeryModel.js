const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');
const userModel = require('../../User/models/userModel')

class Surgery extends Model {}

Surgery.init({
  Surgery_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  surgeryName: {
    type: DataTypes.STRING,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  created_by: {
    type: DataTypes.INTEGER,
    references: {
      model: userModel,
      key: 'user_id',
    },
  },
  updated_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'surgery',
});

Surgery.belongsTo(userModel, {
  foreignKey: 'created_by',
  targetKey: 'user_id'
});

module.exports = Surgery;


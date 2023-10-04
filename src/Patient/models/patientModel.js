const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');
const userModel = require('../../User/models/userModel');

class Patient extends Model {}

Patient.init({
  patient_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  patientNumber: {
    type: DataTypes.STRING,
  },
  firstname: {
    type: DataTypes.STRING,
  },
  lastname: {
    type: DataTypes.STRING,
  },
  gender: {
    type: DataTypes.ENUM('male', 'female'),
  },
  dob: {
    type: DataTypes.STRING,
  },
  age: {
    type: DataTypes.INTEGER,
  },
  mobno: {
    type: DataTypes.STRING,
  },
  aadharNo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  abhaNo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  patientHistory: {
    type: DataTypes.STRING,
    allowNull: true,
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
  modelName: 'patient',
});

Patient.belongsTo(userModel, {
  foreignKey: 'created_by',
  targetKey: 'user_id'
});

module.exports = Patient;


const { Sequelize } = require('sequelize');
const dotenv = require("dotenv").config();

let sequelize;

const selectDB = process.env.SELECT_DB;
const dbUser = process.env.POSTGRES_USER;
const dbName = process.env.DB_NAME; 
const dbPass = process.env.POSTGRES_PASSWORD

if (selectDB=='sqlite') {
 console.log("Sqlite Database connected")
 sequelize = new Sequelize('test-db', 'user', 'pass', {
 dialect: 'sqlite',
 //storage: `./dev.sqlite`,
 storage: `./${dbName}.sqlite`,
 });
} else {
 console.log("Postgres Database connected");
 sequelize = new Sequelize(`${dbName}`,`${dbUser}`, `${dbPass}`, {
 dialect: 'postgres',
 host: 'localhost',
 port: 5432,
 logging: false,
 });
}

module.exports = sequelize;

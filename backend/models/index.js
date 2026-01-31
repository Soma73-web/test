const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
require("dotenv").config();

const basename = path.basename(__filename);
const db = {};

// Use existing Sequelize instance from config/db.js
const sequelize = require("../config/db");

// Dynamically load all models in this directory
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const modelFile = require(path.join(__dirname, file));

    let model;

    if (typeof modelFile === "function") {
      // Pattern: module.exports = (sequelize, DataTypes) => { ... }
      model = modelFile(sequelize, Sequelize.DataTypes);
    } else if (modelFile.default && typeof modelFile.default === "function") {
      // Pattern: ES6 default export function
      model = modelFile.default(sequelize, Sequelize.DataTypes);
    } else if (modelFile instanceof Sequelize.Model) {
      // Pattern: module.exports = class extends Model {}
      model = modelFile;
    } else if (modelFile && typeof modelFile === "object" && modelFile.name) {
      // Pattern: module.exports = sequelize.define(...)
      model = modelFile;
    } else {
      console.error(`❌ Invalid model export in ${file}`);
      return;
    }

    db[model.name] = model;
  });

// Run associations if defined in models
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

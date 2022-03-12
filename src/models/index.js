const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  timezone: dbConfig.timezone,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

// db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.account = require("./account.model.js")(sequelize, Sequelize);
db.chitietkham = require("./chitietkham.model.js")(sequelize, Sequelize);
db.image = require("./image.model.js")(sequelize, Sequelize);
db.infordoctor = require("./infordoctor.model.js")(sequelize, Sequelize);
db.inforuser = require("./inforuser.model.js")(sequelize, Sequelize);
db.khambenh = require("./khambenh.model.js")(sequelize, Sequelize);
db.messenger = require("./messenger.model.js")(sequelize, Sequelize);

module.exports = db;
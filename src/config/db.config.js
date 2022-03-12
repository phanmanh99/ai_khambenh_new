module.exports = {
  HOST: process.env.HOST || "localhost",
  USER: process.env.USER || "root",
  PASSWORD: process.env.PASSWORD || "123456",
  DB: process.env.DB || "aisystemnew",
  port: process.env.DB_PORT || 3306,
  dialect: "mysql",
  timezone: "+07:00",
  pool: {
    max: 9,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

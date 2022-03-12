module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define("account", {
    username: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    password: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.INTEGER,
    }
  });

  return Account;
};

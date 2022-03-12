module.exports = (sequelize, DataTypes) => {
  const inforDoctor = sequelize.define("infordoctor", {
    idbacsi: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
    },
    hoten: {
      type: DataTypes.STRING,
    },
    namkn: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    }
  });

  return inforDoctor;
};

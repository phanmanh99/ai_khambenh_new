module.exports = (sequelize, DataTypes) => {
  const Khambenh = sequelize.define("khambenh", {
    idkhambenh: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    idbacsi: {
      type: DataTypes.INTEGER,
    },
    idbenhnhan: {
      type: DataTypes.INTEGER,
    }
  });

  return Khambenh;
};

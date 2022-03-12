module.exports = (sequelize, DataTypes) => {
  const inforUser = sequelize.define("inforuser", {
    idbenhnhan: {
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
    diachi: {
      type: DataTypes.STRING,
    },
    cmnd: {
      type: DataTypes.STRING,
    },
    sdt: {
      type: DataTypes.INTEGER,
    },
    email: {
      type: DataTypes.STRING,
    },
    sobhyt: {
      type: DataTypes.STRING,
    },
    tiensubenh: {
      type: DataTypes.STRING,
    },
  });

  return inforUser;
};

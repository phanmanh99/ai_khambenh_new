module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define("images", {
    idimage: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    idbacsi: {
      type: DataTypes.INTEGER,
    },
    idbenhnhan: {
      type: DataTypes.INTEGER,
    },
    nameimage: {
      type: DataTypes.STRING,
    },
    infer_ai: {
      type: DataTypes.INTEGER,
    },
    infer_doctor: {
      type: DataTypes.INTEGER,
    },
    ghichu: {
      type: DataTypes.STRING,
    },
  });

  return Image;
};

module.exports = (sequelize, DataTypes) => {
    const Chitietkham = sequelize.define("chitietkham", {
      idchitietkham: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      idkhambenh: {
        type: DataTypes.INTEGER,
      },
      nameimage: {
        type: DataTypes.STRING,
      },
      comment_doctor: {
        type: DataTypes.STRING,
      },
      mucdo: {
        type: DataTypes.STRING,
      },
      donthuoc: {
        type: DataTypes.STRING,
      },
      ngaykham: {
        type: DataTypes.STRING,
      }
    });
  
    return Chitietkham;
  };
  
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
      infer_doctor: {
        type: DataTypes.INTEGER,
      },
      mucdo: {
        type: DataTypes.STRING,
      },
      donthuoc: {
        type: DataTypes.STRING,
      }
    });
  
    return Chitietkham;
  };
  
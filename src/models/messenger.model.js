module.exports = (sequelize, DataTypes) => {
    const Messegers = sequelize.define("messengers", {
      idmess: {
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
      messengers: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.BOOLEAN,
      }
    });
  
    return Messegers;
  };
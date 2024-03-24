const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConnection');

const image = sequelize.define('image', {
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  label: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  objectDetectionEnabled: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  }
});

module.exports = image;
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConnection');
const image = require('./imageDataModel');

const detectedObject = sequelize.define('detectedObject', {
  objects: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  mid: {
    type: DataTypes.STRING,
    allowNull: true
  },
  languageCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  score: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  boundingpoly: {
    type: DataTypes.JSONB,
    allowNull: true
  }
});

// Define associations
detectedObject.belongsTo(image, { foreignKey: 'imageId' });
image.hasMany(detectedObject, { foreignKey: 'imageId' });

module.exports = detectedObject;
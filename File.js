// models/File.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('./database');
const Field = require('./Field');

const File = sequelize.define('File', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

File.hasMany(Field, { foreignKey: 'fileId', as: 'fields'});

File.prototype.getFields = async function () {
  try {
    const fields = await Field.findAll({ where: { fileId: this.id } });
    return fields;
  } catch (error) {
    throw new Error('Error retrieving fields');
  }
};

module.exports = File;

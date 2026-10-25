const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Visitor = sequelize.define('Visitor', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  ip: {
    type: DataTypes.STRING,
    defaultValue: 'unknown'
  },
  userAgent: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  page: {
    type: DataTypes.STRING,
    defaultValue: '/'
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'visitors',
  timestamps: true
});

module.exports = Visitor;


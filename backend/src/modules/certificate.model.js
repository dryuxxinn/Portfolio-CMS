const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Certificate = sequelize.define('Certificate', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  _id: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.id;
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  issuer: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('Academic', 'Volunteer', 'Workshop', 'Other'),
    defaultValue: 'Academic'
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  credential_url: {
    type: DataTypes.STRING,
    defaultValue: 'https://www.linkedin.com/in/bgasrdy/'
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'certificates',
  timestamps: true
});

module.exports = Certificate;


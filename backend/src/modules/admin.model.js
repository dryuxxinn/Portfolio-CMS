const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Admin = sequelize.define('Admin', {
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
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fullName: {
    type: DataTypes.STRING,
    defaultValue: 'Bergas Ahmad Ardiansyah'
  },
  email: {
    type: DataTypes.STRING,
    defaultValue: 'bgasrdy@gmail.com'
  },
  role: {
    type: DataTypes.ENUM('Super Admin', 'Admin', 'Editor'),
    defaultValue: 'Super Admin'
  },
  status: {
    type: DataTypes.ENUM('Aktif', 'Nonaktif'),
    defaultValue: 'Aktif'
  },
  lastLogin: {
    type: DataTypes.DATE,
    defaultValue: null
  }
}, {
  tableName: 'admins',
  timestamps: true
});

module.exports = Admin;


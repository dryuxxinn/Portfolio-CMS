const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const SinRegistration = sequelize.define('SinRegistration', {
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
  service_type: {
    type: DataTypes.ENUM('hotspot', 'pppoe'),
    defaultValue: 'hotspot'
  },
  full_name: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  phone: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  profile_plan: {
    type: DataTypes.STRING,
    defaultValue: 'default'
  },
  status: {
    type: DataTypes.ENUM('pending', 'active', 'expired', 'suspended'),
    defaultValue: 'pending'
  },
  ip_address: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  mac_address: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  mikrotik_synced: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  synced_at: {
    type: DataTypes.DATE,
    defaultValue: null
  },
  notes: {
    type: DataTypes.TEXT,
    defaultValue: ''
  }
}, {
  tableName: 'sin_registrations',
  timestamps: true
});

module.exports = SinRegistration;


const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Project = sequelize.define('Project', {
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
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: 'Server'
  },
  client: {
    type: DataTypes.STRING,
    defaultValue: 'Self Project'
  },
  date: {
    type: DataTypes.STRING,
    defaultValue: '2025'
  },
  excerpt: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  features: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  tech_stack: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: false
  },
  gallery: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  status: {
    type: DataTypes.ENUM('draft', 'published'),
    defaultValue: 'published'
  },
  live_url: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  github_url: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'projects',
  timestamps: true
});

module.exports = Project;


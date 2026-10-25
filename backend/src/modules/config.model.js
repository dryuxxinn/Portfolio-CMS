const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const WebConfig = sequelize.define('WebConfig', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  site_name: {
    type: DataTypes.STRING,
    defaultValue: 'Bergas Ahmad Ardiansyah'
  },
  site_initials: {
    type: DataTypes.STRING,
    defaultValue: 'BAA'
  },
  tagline: {
    type: DataTypes.STRING,
    defaultValue: 'Cyber Security Network Engineer'
  },
  hero_roles: {
    type: DataTypes.JSON,
    defaultValue: ['Cyber Security Engineer', 'Network Engineer', 'System Administrator']
  },
  hero_bio: {
    type: DataTypes.TEXT,
    defaultValue: 'Saya adalah praktisi jaringan yang berfokus pada rancangan jaringan dan keamanan sistem. Berpengalaman dalam konfigurasi router, pengelolaan server Linux dan Windows, serta perancangan topologi jaringan adaptif, saya juga mendalami Penetration Testing dan Cyber Forensic. Terbiasa menggunakan SIEM Wazuh, IDS Snort, dan optimasi server.'
  },
  profile_image: {
    type: DataTypes.STRING,
    defaultValue: '/assets/img/profile/profile-square-11.webp'
  },
  resume_url: {
    type: DataTypes.STRING,
    defaultValue: '/CV Bergas Ardiansyah.pdf'
  },
  education: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  experience: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  core_skills: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  tools: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  contact_info: {
    type: DataTypes.JSON,
    defaultValue: {
      domicile: 'Depok, Indonesia',
      whatsapp: '+6285179958005',
      email: 'bgasrdy@gmail.com'
    }
  },
  social_links: {
    type: DataTypes.JSON,
    defaultValue: {
      github: 'https://github.com/dryuxxinn',
      linkedin: 'https://www.linkedin.com/in/bgasrdy/',
      instagram: 'https://www.instagram.com/bgasrdy/',
      blog: 'https://blog.bgasrdy.my.id'
    }
  }
}, {
  tableName: 'web_configs',
  timestamps: true
});

module.exports = WebConfig;


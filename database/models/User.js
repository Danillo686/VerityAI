const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.STRING(64),
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  plan: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'comum', // 'comum' ($90), 'solo' ($200), 'equipe' ($700)
  },
  default_mode: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'normal', // 'empresa' or 'normal'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'users',
  timestamps: false,
});

module.exports = User;


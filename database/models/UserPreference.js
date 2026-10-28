const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserPreference = sequelize.define('UserPreference', {
  user_id: {
    type: DataTypes.STRING(64),
    primaryKey: true,
  },
  theme: {
    type: DataTypes.STRING(50),
    defaultValue: 'dark',
  },
  authorized_folder_path: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  notifications_enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'user_preferences',
  timestamps: false,
});

module.exports = UserPreference;


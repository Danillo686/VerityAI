const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ExecutedTask = sequelize.define('ExecutedTask', {
  id: {
    type: DataTypes.STRING(64),
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },
  task_type: {
    type: DataTypes.STRING(100),
    allowNull: false, // 'word', 'excel', 'pdf', 'email', 'calculation', 'file_organize'
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false, // 'completed', 'preview', 'failed'
  },
  file_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  file_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  details_json: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'executed_tasks',
  timestamps: false,
});

module.exports = ExecutedTask;


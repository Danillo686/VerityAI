const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ChatMessage = sequelize.define('ChatMessage', {
  id: {
    type: DataTypes.STRING(64),
    primaryKey: true,
  },
  session_id: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },
  user_id: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },
  sender: {
    type: DataTypes.STRING(30),
    allowNull: false, // 'user', 'assistant', 'system'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  mode: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'normal', // 'empresa' or 'normal'
  },
  action_type: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  action_payload: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'chat_messages',
  timestamps: false,
});

module.exports = ChatMessage;


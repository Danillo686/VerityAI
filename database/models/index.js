const sequelize = require('../config/database');
const User = require('./User');
const ChatMessage = require('./ChatMessage');
const ExecutedTask = require('./ExecutedTask');
const UserPreference = require('./UserPreference');

// Relationships
User.hasMany(ChatMessage, { foreignKey: 'user_id', as: 'messages', onDelete: 'CASCADE' });
ChatMessage.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(ExecutedTask, { foreignKey: 'user_id', as: 'tasks', onDelete: 'CASCADE' });
ExecutedTask.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasOne(UserPreference, { foreignKey: 'user_id', as: 'preference', onDelete: 'CASCADE' });
UserPreference.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = {
  sequelize,
  User,
  ChatMessage,
  ExecutedTask,
  UserPreference,
};


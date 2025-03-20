const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Doctor = sequelize.define('Doctor', {
    specialization: {
        type: DataTypes.STRING,
        allowNull: false
    },
    experience: {
        type: DataTypes.INTEGER
    },
    description: {
        type: DataTypes.TEXT
    }
});

Doctor.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(Doctor, { foreignKey: 'userId' });

module.exports = Doctor;
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

}, {
    tableName: 'Doctors'
});

Doctor.belongsTo(User, {
    foreignKey: 'userId',
    constraints: false,
    name: 'fk_doctor_user_id'
});

User.hasOne(Doctor, {
    foreignKey: 'userId',
    constraints: false,
    name: 'fk_user_doctor_id'
});

module.exports = Doctor;
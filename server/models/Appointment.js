const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Schedule = require('./Schedule');

const Appointment = sequelize.define('Appointment', {
    reason: {
        type: DataTypes.TEXT
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'canceled', 'completed'),
        defaultValue: 'pending'
    }
});

Appointment.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });
User.hasMany(Appointment, { foreignKey: 'patientId' });

Appointment.belongsTo(Schedule, { foreignKey: 'scheduleId' });
Schedule.hasOne(Appointment, { foreignKey: 'scheduleId' });

module.exports = Appointment;